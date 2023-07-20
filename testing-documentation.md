# Testing

## Table of Contents

- [Preface](#preface)

- [Running the Tests](#running-the-tests)

  - [Run all tests](#run-all-tests)
  - [Additional Configurations](#additional-configurations)
    - [Run a Subset of Tests](#run-a-subset-of-tests)

- [Testing Philosophy](#testing-philosophy)

  - [Use the AAA (Arrange, Act, Assert) pattern](#use-the-aaa-arrange-act-assert-pattern)
  - [Test for the Outcomes](#test-for-the-outcomes)
  - [Start By Testing the Longest Happy Path](#start-by-testing-the-longest-happy-path)
  - [Structure Tests by Routes and Stories](#structure-tests-by-routes-and-stories)

- [Debugging Tips](#debugging-tips)

  - [No match for request](#no-match-for-request)
    - [Check the address](#check-the-address)
    - [Multiple requests to the same nock object](#multiple-requests-to-the-same-nock-object)

- [Useful Resources For Further Reading](#useful-resources-for-further-reading)

## Preface

The back end uses [Jest](https://jestjs.io) as the testing framework of choice and [nock](https://github.com/nock/nock) to mock requests.

We try to mostly write integration tests, with unit tests when necessary.

## Running the Tests

### Run all tests

Make sure you are in the correct working directory.

```bash
$ pwd
~/waterthetrees/wtt_server
```

Then run the command:

```bash
npm test
```

### Additional Configurations

You can add additional arguments to `npm test` by suffixing it with `--`, followed by additional command line arguments.

For all configuration options read [Jest CLI Options](https://jestjs.io/docs/cli).

#### Run a Subset of Tests

Run tests that match a pattern or file name.

```bash
npm test -- myTest.test.js
```

## Testing Philosophy

### Use the AAA (Arrange, Act, Assert) pattern

A test consists of three functional sections.

- **Arrange** – Set up input variables and preconditions.

- **Act** – Perform the behavior under test with the arranged parameters. (typically 1 line of code)

- **Assert** – Verify the result. (typically 1 line of code)

###### [Structure tests by the AAA pattern](https://github.com/goldbergyoni/javascript-testing-best-practices#-%EF%B8%8F-12-structure-tests-by-the-aaa-pattern)

### Test for the Outcomes

Test the outcomes of triggering an action (e.g. API call). That is, we care about what happens at the end of the action, not how it happens.

Some aspects to check for are:

- **Response** - Check the response data correctness, schema, and HTTP status.

- **A new state** - If the behavior under test modifies some data, check that the data is updated correctly.

- **Observability** - Some things must be monitored, like errors or remarkable business events. When a transaction fails, not only do we expect the right response but also correct error handling and proper logging/metrics.

###### [Test the five potential outcomes](https://github.com/testjavascript/nodejs-integration-tests-best-practices#%EF%B8%8F-6-test-the-five-potential-outcomes)

### Start By Testing the Longest Happy Path

According to Wikipedia, [a **happy path** is a default scenario featuring no exceptional or error conditions. For example, the happy path for a function validating credit card numbers would be where none of the validation rules raise an error, thus letting execution continue successfully to the end, generating a positive response.](https://en.wikipedia.org/wiki/Happy_path)

In happy path testing, we test the functionality in the way that it was designed to work. **Don't** try to break it. If all the correct actions were taken, what should the response be?

Only after we test the happy path should we test for corner cases.

### Structure Tests by Routes and Stories

Group tests by routes and within each route use the [When... Then...](https://martinfowler.com/bliki/GivenWhenThen.html) naming pattern to tell the expected behavior of each path. Name all tests clearly enough so that a newcomer could understand the intended outcomes of an action solely through reading the test's description.

Each test should work in isolation and not depend on, nor be affected by previous tests.

###### [Structure tests by routes and stories](https://github.com/testjavascript/nodejs-integration-tests-best-practices#%EF%B8%8F-5-structure-tests-by-routes-and-stories)

## Debugging Tips

### [nock](https://github.com/nock/nock)

#### No match for request

If you set up a nock object

```js
nock('http://localhost:3002/api/trees').get('9').reply(200);
```

And you get `Nock: No match for request` after running the test

```bash
Nock: No match for request {
  "method": "GET",
  "url": "http://localhost:3002/api/trees/9/",
  "headers": {
    "accept": "application/json, text/plain, */*",
    "user-agent": "axios/0.21.1"
  }
}
```

You must have a matching request to the URL specified in the nock object.

```js
const res = await axios.get('http://localhost:3002/api/trees/9');
```

Now we should have a matching call, but the error persists. Double check that both requests resolve to the same URL. For this example, we must change the argument in `.get()` from the nock object.

```js
❌ nock('http://localhost:3002/api/trees').get('9').reply(200)
✅ nock('http://localhost:3002/api/trees').get('/9').reply(200);
```

##### Check the address

Although address that axios is called on should contain the port that the server is on, the nock object should be called _without_ the port.

```js
const response = await axios.get('/api/trees/9');
nock('http://localhost/api').get('/tree/9');
```

##### Multiple requests to the same nock object

A nock object only be used once by default.

```js
nock('http://localhost:3002/api/trees').get('/9').reply(200);

const res1 = await axios.get('http://localhost:3002/api/trees/9');
const res2 = await axios.get('http://localhost:3002/api/trees/9');
```

Although `res1` and `res2` have the same exact API call, the response from `res1` will match the reply block in the nock object while the response from `res2` while correspond to a non-mocked API call.

##### [read-this---about-interceptors](https://github.com/nock/nock#read-this---about-interceptors)

To use the same nock object for multiple API calls, consider using [.persist()](https://github.com/nock/nock#persist).

## Useful Resources For Further Reading

- [testjavascript/nodejs-integration-tests-best-practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [goldbergyoni/javascript-testing-best-practices](https://github.com/testjavascript/nodejs-integration-tests-best-practices)
- [Kent C. Dodds - Write tests. Not too many. Mostly integration.](https://kentcdodds.com/blog/write-tests)
