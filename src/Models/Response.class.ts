export enum ResponseType {
  error = 'error',
  info = 'info',
  success = 'success',
}

export interface Response<D> {
  message: string;
  type: ResponseType;
  data: D;
}

export class ResponseCreator<D> {
  private type: string;
  constructor(
    private statusNumber: number,
    private message: string,
    private data?: D,
    typeOverride?: ResponseType,
  ) {
    if (typeOverride) {
      this.type = typeOverride;
    } else if (
      Math.round(statusNumber / 100) === 2
    ) {
      this.type = ResponseType.success;
    } else {
      this.type = ResponseType.error;
    }
  }

  get status() {
    return this.statusNumber;
  }

  get payload() {
    return {
      message: this.message,
      type: this.type,
      data: this.data,
    };
  }
}
