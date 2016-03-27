import { assert } from 'chai'
import { ALICE, BOB, temporaryIdentity, client } from './common.js'
import identityserver from '../src/identityserver.js'

describe('private api', function() {

  before(async function() {
    let profiles = {
      [BOB.publicUrl + '/profile']: {publicKey: BOB.keyPair.publicKey},
    }
    let lookupProfile = (url) => profiles[url]
    this.tmp = temporaryIdentity(ALICE)
    let server = await identityserver(this.tmp.path, lookupProfile)
    this.app = server.privateApp
  })

  after(function() {
    this.tmp.cleanup()
  })

  it('saves new peer', async function() {
    const bobUrl = 'http://bob.example.com/profile'
    let { body: resp1 } = await client(this.app).post('/peers', {
      profile: bobUrl,
    })
    assert.isTrue(resp1.ok)

    let { body: resp2 } = await client(this.app).get('/peers')
    let bob = resp2.peers.find(p => p.url == bobUrl)
    assert.equal(bob.profile.publicKey.key, BOB.keyPair.publicKey.key)
  })

})