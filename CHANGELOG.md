# apollo-logging-plugin

## 1.0.1

### Patch Changes

- Minor improvement to logging interface.

## 1.0.0

### Major Changes

This is the first release of apollo-logging-plugin, an apollo plugin that logs colorful messages for your Apollo GraphQL operations. This release includes basic features such as:

1. Logging successful & failing operations
2. Logging Error messages to the console
3. Intercept any [Apollo Event Handler](https://www.apollographql.com/docs/apollo-server/integrations/plugins/#responding-to-events) with a logging helper.

#### Basic Usage with @apollo/server

```typescript
import { ApolloServer, BaseContext } from '@apollo/server';
import { ApolloLogPlugin } from 'apollo-logging-plugin';

const server = new ApolloServer<BaseContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloLogPlugin()]
});
```

#### Adding custom [handlers](https://www.apollographql.com/docs/apollo-server/integrations/plugins/#responding-to-events)

```typescript
import { ApolloServer, BaseContext } from '@apollo/server';
import { ApolloLogPlugin } from 'apollo-logging-plugin';

const handlers = (log: Log) => ({
  didEncounterErrors: log.error,
  didResolveOperation: log.info,
  didEncounterSubsequentErrors: (context) =>
    log.error(context, 'Custom Message'),
  parsingDidStart: (context) => {
    // handle event
  }
  // ... other handlers
});

const server = new ApolloServer<BaseContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloLogPlugin(handlers)]
});
```
