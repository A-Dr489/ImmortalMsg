--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: conversations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.conversations (
    convid integer NOT NULL,
    userid1 integer,
    userid2 integer,
    createdat timestamp without time zone DEFAULT now(),
    room text NOT NULL,
    CONSTRAINT chk_user_order CHECK ((userid1 < userid2))
);


ALTER TABLE public.conversations OWNER TO postgres;

--
-- Name: conversations_convid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.conversations_convid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.conversations_convid_seq OWNER TO postgres;

--
-- Name: conversations_convid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.conversations_convid_seq OWNED BY public.conversations.convid;


--
-- Name: friends; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.friends (
    friendid integer NOT NULL,
    reqid integer,
    recvid integer,
    status character varying(10) NOT NULL,
    createdat timestamp without time zone DEFAULT now(),
    updatedat timestamp without time zone,
    CONSTRAINT check_self_add CHECK ((reqid <> recvid))
);


ALTER TABLE public.friends OWNER TO postgres;

--
-- Name: friends_friendid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.friends_friendid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.friends_friendid_seq OWNER TO postgres;

--
-- Name: friends_friendid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.friends_friendid_seq OWNED BY public.friends.friendid;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    msgid integer NOT NULL,
    convid integer,
    senderid integer,
    content text NOT NULL,
    createdat timestamp without time zone DEFAULT now()
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- Name: messages_msgid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.messages_msgid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.messages_msgid_seq OWNER TO postgres;

--
-- Name: messages_msgid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.messages_msgid_seq OWNED BY public.messages.msgid;


--
-- Name: refreshtokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refreshtokens (
    id integer NOT NULL,
    userid integer,
    token text NOT NULL,
    expireat timestamp without time zone NOT NULL,
    createdat timestamp without time zone DEFAULT now()
);


ALTER TABLE public.refreshtokens OWNER TO postgres;

--
-- Name: refreshtokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.refreshtokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.refreshtokens_id_seq OWNER TO postgres;

--
-- Name: refreshtokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.refreshtokens_id_seq OWNED BY public.refreshtokens.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(25) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255),
    createdat timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: conversations convid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations ALTER COLUMN convid SET DEFAULT nextval('public.conversations_convid_seq'::regclass);


--
-- Name: friends friendid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friends ALTER COLUMN friendid SET DEFAULT nextval('public.friends_friendid_seq'::regclass);


--
-- Name: messages msgid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages ALTER COLUMN msgid SET DEFAULT nextval('public.messages_msgid_seq'::regclass);


--
-- Name: refreshtokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refreshtokens ALTER COLUMN id SET DEFAULT nextval('public.refreshtokens_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: conversations conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (convid);


--
-- Name: conversations conversations_room_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_room_key UNIQUE (room);


--
-- Name: friends friends_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friends
    ADD CONSTRAINT friends_pkey PRIMARY KEY (friendid);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (msgid);


--
-- Name: refreshtokens refreshtokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refreshtokens
    ADD CONSTRAINT refreshtokens_pkey PRIMARY KEY (id);


--
-- Name: conversations unique_conv; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT unique_conv UNIQUE (userid1, userid2);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_conversation_user1; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_conversation_user1 ON public.conversations USING btree (userid1);


--
-- Name: idx_conversation_user2; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_conversation_user2 ON public.conversations USING btree (userid2);


--
-- Name: idx_friends_recvid; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_friends_recvid ON public.friends USING btree (recvid);


--
-- Name: idx_friends_reqid; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_friends_reqid ON public.friends USING btree (reqid);


--
-- Name: idx_messages_convid_createdat; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_convid_createdat ON public.messages USING btree (convid, createdat);


--
-- Name: unique_idx_pair; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_idx_pair ON public.friends USING btree (LEAST(reqid, recvid), GREATEST(reqid, recvid));


--
-- Name: conversations conversations_userid1_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_userid1_fkey FOREIGN KEY (userid1) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: conversations conversations_userid2_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_userid2_fkey FOREIGN KEY (userid2) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: friends friends_recvid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friends
    ADD CONSTRAINT friends_recvid_fkey FOREIGN KEY (recvid) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: friends friends_reqid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friends
    ADD CONSTRAINT friends_reqid_fkey FOREIGN KEY (reqid) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: messages messages_convid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_convid_fkey FOREIGN KEY (convid) REFERENCES public.conversations(convid) ON DELETE CASCADE;


--
-- Name: messages messages_senderid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_senderid_fkey FOREIGN KEY (senderid) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: refreshtokens refreshtokens_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refreshtokens
    ADD CONSTRAINT refreshtokens_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

