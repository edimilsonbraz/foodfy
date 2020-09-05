CREATE TABLE "chefs" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "avatar_url" text,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "path" text
);

CREATE TABLE "recipe_files" (
  "id" SERIAL PRIMARY KEY,
  "recipe_id" int UNIQUE,
  "file_id" int UNIQUE
);

CREATE TABLE "recipes" (
  "id" SERIAL PRIMARY KEY,
  "chefs_id" int,
  "image" text NOT NULL,
  "title" text NOT NULL,
  "information" text,
  "created_at" timestamp DEFAULT (now()),
  "ingredients" text[],
  "preparation" text[]
);

ALTER TABLE "files" ADD FOREIGN KEY ("id") REFERENCES "recipe_files" ("file_id");

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id");

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");

ALTER TABLE "recipes" ADD FOREIGN KEY ("chefs_id") REFERENCES "chefs" ("id");
