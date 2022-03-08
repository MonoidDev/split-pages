import { Left } from '@monoid-dev/reform';

export class InvalidSearch extends Error {
  constructor(message: string, public result: Left<unknown>) {
    super(message);
  }
}
