CREATE DATABASE foodfydb;


CREATE TABLE "chefs" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "file_id" INTEGER,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "path" text NOT NULL
);

CREATE TABLE "recipe_files" (
  "id" SERIAL PRIMARY KEY,
  "recipe_id" INTEGER NOT NULL,
  "file_id" INTEGER NOT NULL
);

CREATE TABLE "recipes" (
  "id" SERIAL PRIMARY KEY,
  "chef_id" int NOT NULL,
  "title" text NOT NULL,
  "ingredients" text[] NOT NULL,
  "preparation" text[] NOT NULL,
  "information" text,
  "created_at" timestamp DEFAULT (now()),
);

--Creating recipe_files relations

ALTER TABLE "recipe_files"
ADD CONSTRAINT recipe_files_recipe_id_fkey
FOREIGN KEY ("recipe_id") 
REFERENCES "recipes" ("id")
ON DELETE CASCADE;

ALTER TABLE "recipe_files"
ADD CONSTRAINT recipe_files_file_id_fkey
FOREIGN KEY ("file_id") 
REFERENCES "files" ("id")
ON DELETE CASCADE;

--Creating recipes and chef relation

ALTER TABLE "recipes"
ADD CONSTRAINT recipes_chef_id_fkey
FOREIGN KEY ("chef_id") 
REFERENCES "chefs" ("id")
ON DELETE CASCADE;

--Creating recipes and user relation

-- ALTER TABLE "recipes"
-- ADD CONSTRAINT recipes_chef_id_fkey
-- FOREIGN KEY ("user_id") 
-- REFERENCES "users" ("id")
-- ON DELETE CASCADE;

-- --Creating chefs and files relation

-- ALTER TABLE "chefs"
-- ADD CONSTRAINT chefs_file_id_fkey
-- FOREIGN KEY ("file_id") 
-- REFERENCES "files" ("id");