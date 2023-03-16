# Apollo Logging Plugin

Adds colorful logs to your Apollo Server. 

## Installation

```bash
npm i apollo-logging-plugin #npm
yarn add apollo-logging-plugin #yarn
pnpm add apollo-logging-plugin #pnpm
```

## Usage

```typescript
import { ApolloServer, BaseContext } from '@apollo/server';
import { ApolloLogPlugin } from 'apollo-logging-plugin';

const server = new ApolloServer<BaseContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloLogPlugin()]
});
```

### Custom [handlers](https://www.apollographql.com/docs/apollo-server/integrations/plugins/#responding-to-events)

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

> This is a typescript library built with `ts-lib-starter`. [Build yours now ->]('https://github.com/youssef-ahamid/ts-lib-starter/')
