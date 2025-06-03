const html = await loadHtml("html/volume.html");

class VolumeTrayProcess extends TrayIconProcess {
  constructor(handler, pid, parentPid, data) {
    super(handler, pid, parentPid, data);

    this.parent = handler.getProcess(this.parentPid);
    /** @type {BaseService} */
    this.service = this.parent.service;
  }

  async renderPopup() {
    const body = this.getPopupBody();
    body.innerHTML = html;
    this.volumeControl = body.querySelector("#volumeControl");
    this.muteButton = body.querySelector("#muteButton");

    this.volumeControl.addEventListener("change", () => {
      if (this._disposed) return;

      this.service.setVolume(this.volumeControl.value);
    });

    this.muteButton.addEventListener("click", () => {
      if (this._disposed) return;

      this.service.mute();
    });

    this.service.status.subscribe((v) => {
      if (this._disposed) return;

      this.updateState(v);
    });
  }

  /** @param {ManagementStatus} v */
  async updateState(v) {
    this.muteButton.classList.toggle("icon-volume-off", v.muted);
    this.muteButton.classList.toggle("icon-volume-2", !v.muted);

    this.volumeControl.value = v.volume;
  }
}

return { VolumeTrayProcess };
