const shellPid = +env.get("shell_pid");
const { proc } = await load("process.js");

if (!navigator.userAgent.toLowerCase().includes("electron")) return;

runApp(proc, $METADATA, shellPid);
