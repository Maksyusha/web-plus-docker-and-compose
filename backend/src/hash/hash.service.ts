import { Injectable } from '@nestjs/common';
import { compareSync, hashSync, genSaltSync } from 'bcrypt';

@Injectable()
export class HashService {
  hash(password: string) {
    return hashSync(password, genSaltSync(10));
  }

  compare(password: string, hash: string): boolean {
    return compareSync(password, hash);
  }
}
