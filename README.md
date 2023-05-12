<h1 align="center">𝕊𝕚𝕞𝕡𝕝𝕖 𝔹𝕝𝕠𝕘</h1>

> Blog template build with [Next JS](https://nextjs.org/) and [React](https://legacy.reactjs.org/)

## Demo

## Start

**_Clone_**

```bash
git clone https://github.com/GVatest/simple-blog
cd simple-blog
```

**_Install_**

```bash
npm install
# or
yarn install
```

**_Setup_**

generate prisma client / apply migrations

```bash
npx prisma generate
npx prisma migrate deploy
```

environment variables

```bash
OCTOKIT_ACCESS_TOKEN = "your token from https://github.com/settings/tokens/new"
```

create new superuser

```bash
node createsuperuser.js --username <name> --password <password>
```

**_Start_**

```bash
npm run dev
# or
yarn dev
```

**_Build_**

```bash
npm run build
# or
yarn build
```

## Credits

Contributors:

- 👤 **Vasiliy Ganja**
  - `Github`: [@Gvatest](https://github.com/gvatest)

## License

[![Licence](https://img.shields.io/github/license/Ileriayo/markdown-badges?style=for-the-badge)](./LICENSE)
