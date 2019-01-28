
CREATE TABLE public.store
(
    id integer NOT NULL DEFAULT nextval('store_id_seq'::regclass),
    key character varying(255) COLLATE pg_catalog."default" NOT NULL,
    value text COLLATE pg_catalog."default" NOT NULL,
    salt character varying(20) COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT store_pkey PRIMARY KEY (id),
    CONSTRAINT unique_key UNIQUE (key)

)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.store
    OWNER to postgres;

-- Index: key_index

-- DROP INDEX public.key_index;

CREATE UNIQUE INDEX key_index
    ON public.store USING btree
    (key COLLATE pg_catalog."default")
    TABLESPACE pg_default;