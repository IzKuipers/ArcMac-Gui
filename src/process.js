const html = await loadHtml("body.html");
const { VolumeTrayProcess } = await load("js/volume.js");
const { BrightnessTrayProcess } = await load("js/brightness.js");

class proc extends Process {
  constructor(handler, pid, parentPid, app, workingDirectory) {
    super(handler, pid, parentPid, app, workingDirectory);

    this.service = daemon.serviceHost.getService("ArcMacMgmtSvc");
    this.name = app.id;
    this.app = { app };
  }

  async start() {
    /** @type {ShellRuntime} */
    const shell = this.handler.getProcess(+env.get("shell_pid"));

    const brightnessIcon = await fs.direct(
      util.join(workingDirectory, "img/brightness.svg")
    );
    const volumeIcon = await fs.direct(
      util.join(workingDirectory, "img/volume.svg")
    );

    this.createSleepButton();

    shell.trayHost.createTrayIcon(
      this.pid,
      "ArcMac_VolumeControl",
      {
        popup: {
          width: 60,
          height: 200,
        },
        icon: volumeIcon,
      },
      VolumeTrayProcess
    );

    shell.trayHost.createTrayIcon(
      this.pid,
      "ArcMac_BrightnessControl",
      {
        popup: {
          width: 60,
          height: 200,
        },
        icon: brightnessIcon,
      },
      BrightnessTrayProcess
    );
  }

  createSleepButton() {
    const sleepIcon = document.createElement("span");
    sleepIcon.className = "lucide icon-moon";
    this.sleepButton = document.createElement("button");
    this.sleepButton.className = "sleep";
    this.sleepButton.append(sleepIcon);
    this.sleepButton.addEventListener("click", async () => {
      handler.getProcess(+env.get("izk_screenlocker_pid"))?.show();
      await Sleep(500);
      this.service.sleep();
    });

    const actions = document.querySelector(
      "#arcShell div.startmenu div.actions"
    );

    actions?.append(this.sleepButton);
  }

  async stop() {
    this.sleepButton?.remove();
  }
}

return { proc };
