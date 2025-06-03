const html = await loadHtml("html/brightness.html");

class BrightnessTrayProcess extends TrayIconProcess {
  constructor(handler, pid, parentPid, data) {
    super(handler, pid, parentPid, data);

    this.parent = handler.getProcess(this.parentPid);
    /** @type {BaseService} */
    this.service = this.parent.service;
  }

  async renderPopup() {
    const body = this.getPopupBody();
    const css = await this.fs.direct(util.join(workingDirectory, "style.css"));

    body.innerHTML = `<link rel="stylesheet" href="${css}">${html}`;
    this.brightnessControl = body.querySelector("#brightnessControl");

    this.brightnessControl.addEventListener("change", () => {
      if (this._disposed) return;

      this.service.brightnessSet(this.brightnessControl.value);
    });

    this.service.status.subscribe((v) => {
      if (this._disposed) return;

      this.updateState(v);
    });
  }

  /** @param {ManagementStatus} v */
  async updateState(v) {
    this.brightnessControl.value = v.brightness.percent;
  }
}

return { BrightnessTrayProcess };
