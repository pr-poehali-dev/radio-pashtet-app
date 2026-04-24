"""
Авторизация пользователей Радио Паштет.
Один endpoint, действие передаётся через поле action: register | login | me | logout
"""
import json
import os
import hashlib
import secrets
import psycopg2

SCHEMA = "t_p42019823_radio_pashtet_app"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Token",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def ok(data: dict, status: int = 200) -> dict:
    return {"statusCode": status, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps(data, ensure_ascii=False)}


def err(msg: str, status: int = 400) -> dict:
    return {"statusCode": status, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps({"error": msg}, ensure_ascii=False)}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            pass

    action = body.get("action") or (event.get("queryStringParameters") or {}).get("action", "")

    # ── REGISTER ─────────────────────────────────────────────────
    if action == "register":
        name = (body.get("name") or "").strip()
        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""

        if not name:
            return err("Введите имя")
        if not email or "@" not in email:
            return err("Некорректный email")
        if len(password) < 6:
            return err("Пароль минимум 6 символов")

        pw_hash = hash_password(password)
        token = secrets.token_hex(32)

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email = %s", (email,))
        if cur.fetchone():
            conn.close()
            return err("Пользователь с таким email уже существует")

        cur.execute(
            f"INSERT INTO {SCHEMA}.users (name, email, password_hash) VALUES (%s, %s, %s) RETURNING id",
            (name, email, pw_hash)
        )
        user_id = cur.fetchone()[0]
        cur.execute(f"INSERT INTO {SCHEMA}.sessions (user_id, token) VALUES (%s, %s)", (user_id, token))
        conn.commit()
        conn.close()

        return ok({"token": token, "user": {"id": user_id, "name": name, "email": email}}, 201)

    # ── LOGIN ─────────────────────────────────────────────────────
    if action == "login":
        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""

        if not email or not password:
            return err("Введите email и пароль")

        pw_hash = hash_password(password)
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, name, email FROM {SCHEMA}.users WHERE email = %s AND password_hash = %s",
            (email, pw_hash)
        )
        row = cur.fetchone()
        if not row:
            conn.close()
            return err("Неверный email или пароль")

        user_id, name, user_email = row
        token = secrets.token_hex(32)
        cur.execute(f"INSERT INTO {SCHEMA}.sessions (user_id, token) VALUES (%s, %s)", (user_id, token))
        conn.commit()
        conn.close()

        return ok({"token": token, "user": {"id": user_id, "name": name, "email": user_email}})

    # ── ME ────────────────────────────────────────────────────────
    if action == "me":
        token = (event.get("headers") or {}).get("X-Session-Token", "")
        if not token:
            return err("Не авторизован", 401)

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"""SELECT u.id, u.name, u.email FROM {SCHEMA}.users u
                JOIN {SCHEMA}.sessions s ON s.user_id = u.id
                WHERE s.token = %s""",
            (token,)
        )
        row = cur.fetchone()
        conn.close()

        if not row:
            return err("Сессия не найдена", 401)

        user_id, name, email = row
        return ok({"user": {"id": user_id, "name": name, "email": email}})

    # ── LOGOUT ────────────────────────────────────────────────────
    if action == "logout":
        token = (event.get("headers") or {}).get("X-Session-Token", "")
        if token:
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(f"UPDATE {SCHEMA}.sessions SET created_at = created_at WHERE token = %s", (token,))
            conn.commit()
            conn.close()
        return ok({"ok": True})

    return err("Неизвестное действие", 400)
