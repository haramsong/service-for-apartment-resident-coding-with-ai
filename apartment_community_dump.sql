--
-- PostgreSQL database dump
--

\restrict YEyX3BTqOHwOapxRkhoRT6sr3hyZTkC6gQwwVNaO93MD8WjncEyqaim8Aedz7Iu

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE ONLY public.users DROP CONSTRAINT users_apartment_id_fkey;
ALTER TABLE ONLY public.reservations DROP CONSTRAINT reservations_user_id_fkey;
ALTER TABLE ONLY public.reservations DROP CONSTRAINT reservations_facility_id_fkey;
ALTER TABLE ONLY public.posts DROP CONSTRAINT posts_author_id_fkey;
ALTER TABLE ONLY public.posts DROP CONSTRAINT posts_apartment_id_fkey;
ALTER TABLE ONLY public.notices DROP CONSTRAINT notices_author_id_fkey;
ALTER TABLE ONLY public.notices DROP CONSTRAINT notices_apartment_id_fkey;
ALTER TABLE ONLY public.management_fees DROP CONSTRAINT management_fees_user_id_fkey;
ALTER TABLE ONLY public.management_fees DROP CONSTRAINT management_fees_apartment_id_fkey;
ALTER TABLE ONLY public.facilities DROP CONSTRAINT facilities_apartment_id_fkey;
ALTER TABLE ONLY public.complaints DROP CONSTRAINT complaints_user_id_fkey;
ALTER TABLE ONLY public.complaints DROP CONSTRAINT complaints_apartment_id_fkey;
ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_post_id_fkey;
ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_author_id_fkey;
DROP INDEX public.users_email_key;
DROP INDEX public.reservations_facility_id_date_start_time_key;
ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
ALTER TABLE ONLY public.reservations DROP CONSTRAINT reservations_pkey;
ALTER TABLE ONLY public.posts DROP CONSTRAINT posts_pkey;
ALTER TABLE ONLY public.notices DROP CONSTRAINT notices_pkey;
ALTER TABLE ONLY public.management_fees DROP CONSTRAINT management_fees_pkey;
ALTER TABLE ONLY public.facilities DROP CONSTRAINT facilities_pkey;
ALTER TABLE ONLY public.complaints DROP CONSTRAINT complaints_pkey;
ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_pkey;
ALTER TABLE ONLY public.apartments DROP CONSTRAINT apartments_pkey;
ALTER TABLE ONLY public._prisma_migrations DROP CONSTRAINT _prisma_migrations_pkey;
DROP TABLE public.users;
DROP TABLE public.reservations;
DROP TABLE public.posts;
DROP TABLE public.notices;
DROP TABLE public.management_fees;
DROP TABLE public.facilities;
DROP TABLE public.complaints;
DROP TABLE public.comments;
DROP TABLE public.apartments;
DROP TABLE public._prisma_migrations;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Name: apartments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.apartments (
    id text NOT NULL,
    name character varying(100) NOT NULL,
    address text NOT NULL,
    total_units integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comments (
    id text NOT NULL,
    post_id text NOT NULL,
    author_id text NOT NULL,
    content text NOT NULL,
    is_anonymous boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: complaints; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.complaints (
    id text NOT NULL,
    apartment_id text NOT NULL,
    user_id text NOT NULL,
    title character varying(200) NOT NULL,
    content text NOT NULL,
    category character varying(50),
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    images text[],
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: facilities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.facilities (
    id text NOT NULL,
    apartment_id text NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    capacity integer,
    operating_hours jsonb,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: management_fees; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.management_fees (
    id text NOT NULL,
    apartment_id text NOT NULL,
    user_id text NOT NULL,
    year integer NOT NULL,
    month integer NOT NULL,
    amount integer NOT NULL,
    details jsonb,
    paid boolean DEFAULT false NOT NULL,
    paid_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: notices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notices (
    id text NOT NULL,
    apartment_id text NOT NULL,
    title character varying(200) NOT NULL,
    content text NOT NULL,
    category character varying(50),
    is_urgent boolean DEFAULT false NOT NULL,
    author_id text NOT NULL,
    views integer DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.posts (
    id text NOT NULL,
    apartment_id text NOT NULL,
    author_id text NOT NULL,
    title character varying(200) NOT NULL,
    content text NOT NULL,
    category character varying(50),
    is_anonymous boolean DEFAULT false NOT NULL,
    views integer DEFAULT 0 NOT NULL,
    likes integer DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: reservations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reservations (
    id text NOT NULL,
    facility_id text NOT NULL,
    user_id text NOT NULL,
    date date NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    status character varying(20) DEFAULT 'confirmed'::character varying NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id text NOT NULL,
    email character varying(255) NOT NULL,
    name character varying(50) NOT NULL,
    apartment_id text,
    dong character varying(10),
    ho character varying(10),
    role character varying(20) DEFAULT 'resident'::character varying NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    password character varying(255) DEFAULT 'temp_password'::character varying NOT NULL
);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
fdf9557e-fda9-47d0-a6c1-72df252783dd	8c4345775f788653541564916613b238c57235d4f15799e5d81243ed2ea5286e	2025-10-27 07:55:41.014879+00	20251027075540_init	\N	\N	2025-10-27 07:55:40.960955+00	1
18f20a00-bc4c-4521-ae44-538386e82636	cb61fc8412a57ea6bf352ebc66f793bf8a22d5fdff327dce37fd4d737afe7cd3	2025-10-28 01:46:55.601028+00	20251028014655_add_password_field	\N	\N	2025-10-28 01:46:55.592739+00	1
\.


--
-- Data for Name: apartments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.apartments (id, name, address, total_units, created_at, updated_at) FROM stdin;
63001d52-61ae-4485-ae2c-79bbd6fcfec2	우리아파트	서울시 강남구 테헤란로 123	300	2025-10-27 07:56:26.53	2025-10-27 07:56:26.53
7fba4eda-a390-4ca6-9028-6ccd44ef1f1e	우리아파트	서울시 강남구 테헤란로 123	300	2025-10-28 05:15:39.596	2025-10-28 05:15:39.596
c7b3dd32-dc05-49e9-aeb8-ba4a4c4a629b	우리아파트	서울시 강남구 테헤란로 123	300	2025-10-28 05:16:59.808	2025-10-28 05:16:59.808
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.comments (id, post_id, author_id, content, is_anonymous, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: complaints; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.complaints (id, apartment_id, user_id, title, content, category, status, images, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: facilities; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.facilities (id, apartment_id, name, description, capacity, operating_hours, created_at) FROM stdin;
d13a5c03-80b1-413f-ace1-98544df8bf00	63001d52-61ae-4485-ae2c-79bbd6fcfec2	헬스장	최신 운동 기구 완비	20	{"open": "06:00", "close": "22:00"}	2025-10-27 07:56:26.572
5d939783-0e95-4895-b6a6-1d09c9c06ddf	63001d52-61ae-4485-ae2c-79bbd6fcfec2	독서실	조용한 학습 공간	30	{"open": "09:00", "close": "21:00"}	2025-10-27 07:56:26.572
61c66264-aa33-4b41-9b2c-8a68e2f8c741	63001d52-61ae-4485-ae2c-79bbd6fcfec2	회의실	입주민 모임 공간	15	{"open": "09:00", "close": "21:00"}	2025-10-27 07:56:26.572
\.


--
-- Data for Name: management_fees; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.management_fees (id, apartment_id, user_id, year, month, amount, details, paid, paid_at, created_at) FROM stdin;
\.


--
-- Data for Name: notices; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notices (id, apartment_id, title, content, category, is_urgent, author_id, views, created_at, updated_at) FROM stdin;
1c53fcc5-5ce4-4a0a-a62c-ce10443f3516	63001d52-61ae-4485-ae2c-79bbd6fcfec2	엘리베이터 점검 안내	10월 30일 오전 9시부터 12시까지 엘리베이터 정기 점검이 있습니다.	maintenance	t	2b7969d4-525f-4505-ac17-d1369874687b	0	2025-10-27 07:56:26.566	2025-10-27 07:56:26.566
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.posts (id, apartment_id, author_id, title, content, category, is_anonymous, views, likes, created_at, updated_at) FROM stdin;
2890cdac-7ee6-4a45-9391-1b08b234f0cd	63001d52-61ae-4485-ae2c-79bbd6fcfec2	8ddbfb4b-0040-43d4-9813-83155af247d7	아이 놀이터 이용 시간 문의	놀이터 이용 가능 시간이 언제까지인가요?	question	f	1	0	2025-10-27 07:56:26.582	2025-10-28 07:13:06.968
\.


--
-- Data for Name: reservations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reservations (id, facility_id, user_id, date, start_time, end_time, status, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, name, apartment_id, dong, ho, role, created_at, updated_at, password) FROM stdin;
2b7969d4-525f-4505-ac17-d1369874687b	admin@apartment.com	관리사무소	63001d52-61ae-4485-ae2c-79bbd6fcfec2	\N	\N	admin	2025-10-27 07:56:26.554	2025-10-28 05:18:28.691	$2b$10$9yTYDa.yN.hzLeoUj0CM0OBL9BEg1a/H2xk.3xToi/RBcWmn9PA32
8ddbfb4b-0040-43d4-9813-83155af247d7	user@apartment.com	홍길동	63001d52-61ae-4485-ae2c-79bbd6fcfec2	101	1001	resident	2025-10-27 07:56:26.562	2025-10-28 05:18:28.691	$2b$10$9yTYDa.yN.hzLeoUj0CM0OBL9BEg1a/H2xk.3xToi/RBcWmn9PA32
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: apartments apartments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.apartments
    ADD CONSTRAINT apartments_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: complaints complaints_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_pkey PRIMARY KEY (id);


--
-- Name: facilities facilities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.facilities
    ADD CONSTRAINT facilities_pkey PRIMARY KEY (id);


--
-- Name: management_fees management_fees_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.management_fees
    ADD CONSTRAINT management_fees_pkey PRIMARY KEY (id);


--
-- Name: notices notices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notices
    ADD CONSTRAINT notices_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: reservations reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: reservations_facility_id_date_start_time_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX reservations_facility_id_date_start_time_key ON public.reservations USING btree (facility_id, date, start_time);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: comments comments_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: comments comments_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: complaints complaints_apartment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_apartment_id_fkey FOREIGN KEY (apartment_id) REFERENCES public.apartments(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: complaints complaints_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: facilities facilities_apartment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.facilities
    ADD CONSTRAINT facilities_apartment_id_fkey FOREIGN KEY (apartment_id) REFERENCES public.apartments(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: management_fees management_fees_apartment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.management_fees
    ADD CONSTRAINT management_fees_apartment_id_fkey FOREIGN KEY (apartment_id) REFERENCES public.apartments(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: management_fees management_fees_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.management_fees
    ADD CONSTRAINT management_fees_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: notices notices_apartment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notices
    ADD CONSTRAINT notices_apartment_id_fkey FOREIGN KEY (apartment_id) REFERENCES public.apartments(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: notices notices_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notices
    ADD CONSTRAINT notices_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: posts posts_apartment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_apartment_id_fkey FOREIGN KEY (apartment_id) REFERENCES public.apartments(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: posts posts_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: reservations reservations_facility_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_facility_id_fkey FOREIGN KEY (facility_id) REFERENCES public.facilities(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: reservations reservations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: users users_apartment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_apartment_id_fkey FOREIGN KEY (apartment_id) REFERENCES public.apartments(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict YEyX3BTqOHwOapxRkhoRT6sr3hyZTkC6gQwwVNaO93MD8WjncEyqaim8Aedz7Iu

