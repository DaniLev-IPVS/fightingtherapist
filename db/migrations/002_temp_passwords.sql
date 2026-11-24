-- Temporary passwords: admins must pick their own on first sign-in.
alter table admin_users add column if not exists must_change_password boolean not null default false;
alter table admin_users add column if not exists temp_password_expires_at timestamptz;
