import nock from 'nock';
import { Base64 } from 'js-base64';
import { loginVCSA } from '../src';

describe('vCenter Session', () => {
  const url = 'https://vcsa.example.com';
  const user = { username: 'John', password: 'password' };
  test('Should return session token', async () => {
    nock(url)
      .matchHeader('Authorization', `Basic ${Base64.encode(user.username + ':' + user.password)}`)
      .post('/rest/com/vmware/cis/session')
      .reply(200, { value: '544845' });

    expect(loginVCSA({ ...user, url })).resolves.toEqual('544845');
  });
});
