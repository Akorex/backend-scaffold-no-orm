### Backend Scaffold Tool

This repository helps to quickly handle the boilerplate code for my expressjs applications. It is intended to be lightweight so it makes only one assumption:
➡️ You're using **TypeORM** with **PostgreSQL**.

In order to use this tool, do the following:

1. Create a new folder for your project.
2. Clone the repo: `git clone https://github.com/Akorex/backend-scaffold.git`
3. Move the content: `mv backend-scaffold/* backend-scaffold/.[!.]* . `
4. Remove git: `rm -rf .git`
5. Initialize git: `git init`
6. Install dependencies: `npm install`
7. Remove the backend-scaffold directory: `rmdir backend-scaffold`

If you're not using the database or ORM from above, for step 2, do this instead:
➡️ `git clone --branch no-orm --single-branch https://github.com/Akorex/backend-scaffold.git`
