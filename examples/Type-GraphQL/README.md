# Type-GraphQL vCenter Example

Get a token by sending the Login Mutation

```graphql
mutation {
  Login(user: { username: "Administrator@vsphere.local", password: "password", url: "https://vsphere.local" })
}
```

Use that token as a Authorization Header

Authorization | Bearer XYZ
