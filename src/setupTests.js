// Provide support for Response, Headers etc in test env too
// Makes them available globally
import 'isomorphic-fetch'

jest.mock('./data/libraries.json', () => ([ {
  "name": "aphrodite",
  "repository": "Khan/aphrodite"
}]));