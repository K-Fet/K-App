function systemd() {
  console.log('[install] In order to configure systemd, you must do this:');
  console.log('[install]   - Copy files under tools/config-samples/ into /etc/systemd/system/');
  console.log('[install]   - Edit these files as needed (if you uses /srv/ as folder it should be good)');
  console.log('[install]   - Reload systemd config with `systemctl daemon-reload`');
  console.log('[install]   - Copy the Caddyfile into /srv/caddy/Caddyfile');
  console.log('[install]   - Edit the file as needed');
  console.log('[install]   - Set the right permissions with');
  console.log('[install]      `chown root:www-data /srv/caddy/Caddyfile`');
  console.log('[install]      `chmod 444 /srv/caddy/Caddyfile`');
  console.log('[install]   - Start caddy with `systemctl enable --now caddy`');
  console.log('[install]   - Run and enable auto restart for as much instances as configured in the Caddyfile with');
  console.log('[install]      `systemctl enable --now kapp@3000`');
  console.log('[install]      `systemctl enable --now kapp@....`');
  console.log('[install]   - Enable backup timer with `systemctl enable --now kapp-backup.timer`');
}

module.exports = {
  systemd,
};
