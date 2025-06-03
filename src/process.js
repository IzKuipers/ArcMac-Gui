const html = await loadHtml("body.html");

class proc extends ThirdPartyAppProcess {
  volume = 0;
  muted = false;
  brightness = 0;
  constructor(handler, pid, parentPid, app, workingDirectory, ...args) {
    super(handler, pid, parentPid, app, workingDirectory);

    this.service = daemon.serviceHost.getService("ArcMacMgmtSvc");
  }

  async render() {
    const body = this.getBody();
    body.innerHTML = html;
    this.volumeControl = body.querySelector("#volumeControl");
    this.brightnessControl = body.querySelector("#brightnessControl");
    this.volumeMute = body.querySelector("#volumeMute");
    this.sleepButton = body.querySelector("#sleepButton");

    this.service.status.subscribe((v) => {
      this.updateState(v);
    });

    this.volumeControl.addEventListener("change", () => {
      this.service.setVolume(this.volumeControl.value);
    });

    this.brightnessControl.addEventListener("change", () => {
      this.service.brightnessSet(this.brightnessControl.value);
    });

    this.volumeMute.addEventListener("click", () => {
      this.service.mute();
    });

    this.sleepButton.addEventListener("click", async () => {
      handler.getProcess(+env.get("izk_screenlocker_pid"))?.show();
      await Sleep(500);
      this.service.sleep();
    });
  }

  /**
   *
   * @param {ManagementStatus} v
   */
  updateState(v) {
    this.volume = v.volume;
    this.brightness = v.brightness.percent;
    this.muted = v.muted;

    this.volumeControl.value = v.volume;
    this.brightnessControl.value = v.brightness.percent;
    this.volumeMute.innerText = v.muted ? "Unmute" : "Mute";
  }
}

return { proc };
