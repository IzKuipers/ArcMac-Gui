declare global {
  interface ManagementStatus {
    volume: number;
    muted: boolean;
    brightness: {
      device: string;
      className: string;
      max: number;
      percent: number;
      current: number;
    };
  }
}

export {};
