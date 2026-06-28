// PM2 設定檔
module.exports = {
  apps: [
    {
      name: "henghui-web",
      cwd: "/var/www/henghui",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        NEXT_PUBLIC_SITE_URL: "https://ezfix.com.tw",
      },
      error_file: "/var/log/henghui/error.log",
      out_file: "/var/log/henghui/out.log",
      time: true,
    },
  ],
};
