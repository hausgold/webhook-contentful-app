interface Webhook {
  name?: string;
  buttonText?: string;
  webhookUrl?: string;
  authToken?: string;
  eventType?: string;
}

export interface ContentType {
  sys: { id: string };
  name: string;
  fields?: Field[];
}

export interface Parameters {
  webhooks?: Webhook[];
}
