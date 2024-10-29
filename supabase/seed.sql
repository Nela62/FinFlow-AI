--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--
INSERT INTO "auth"."flow_state"("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at")
  VALUES ('a4b32ab2-07b3-449d-a3c7-4402062605a7', 'e6b40dc6-08c9-4b0c-ab93-af19fb604abe', '80e3e55a-2e36-4493-99ff-d14116a9a286', 's256', 'IJieuT6vAFU7uYw16ZMB_vutPs91T1T_blN5i1-ztIg', 'email', '', '', '2024-09-29 19:45:54.485073+00', '2024-09-29 19:45:54.485073+00', 'email/signup', NULL);

--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--
INSERT INTO "auth"."users"("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous")
  VALUES ('00000000-0000-0000-0000-000000000000', '8c693361-135d-4489-a025-4701e6d76ef4', 'authenticated', 'authenticated', 'helen@finpanel.com', '$2a$10$z.S6SBL8bDI.jGlYH4AAcuAC5Itffww.PQLDEOFyizaQB9kFkBf/W', '2024-10-25 02:05:24.903079+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-10-25 02:05:36.327853+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-10-25 02:05:24.889151+00', '2024-10-29 17:03:45.701152+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE);

--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--
INSERT INTO "auth"."identities"("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id")
  VALUES ('8c693361-135d-4489-a025-4701e6d76ef4', '8c693361-135d-4489-a025-4701e6d76ef4', '{"sub": "8c693361-135d-4489-a025-4701e6d76ef4", "email": "helen@finpanel.com", "email_verified": false, "phone_verified": false}', 'email', '2024-10-25 02:05:24.896891+00', '2024-10-25 02:05:24.896967+00', '2024-10-25 02:05:24.896967+00', '31afe9e6-dc91-4fcc-9c58-75b41819cb52');

INSERT INTO panels(user_id, name, url)
  VALUES ('8c693361-135d-4489-a025-4701e6d76ef4', 'Default', 'wLqnj7Pccb');

--
-- PostgreSQL database dump complete
--
RESET ALL;

