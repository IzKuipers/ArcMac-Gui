if (!navigator.userAgent.toLowerCase().includes("electron")) return;

const shellPid = +env.get("shell_pid");
const { proc } = await load("process.js");

runApp(proc, $METADATA, shellPid);
