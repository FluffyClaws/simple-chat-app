export interface Chat {
  id: string;
  name: string;
  messages: Message[];
  createdBy: string;
}

export interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: number;
}
