(self.webpackChunkzod2gql=self.webpackChunkzod2gql||[]).push([[298],{"./docs/APIReference.mdx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>MDXContent});__webpack_require__("./node_modules/next/dist/compiled/react/index.js");var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/next/dist/compiled/react/jsx-runtime.js"),C_Users_Jameson_Source_AGI_aginterface_src_lib_zod2gql_node_modules_storybook_addon_docs_dist_shims_mdx_react_shim_mjs__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./node_modules/@mdx-js/react/lib/index.js"),_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/@storybook/addon-docs/dist/index.mjs");__webpack_require__("./src/index.ts"),__webpack_require__("./src/mutation.ts"),__webpack_require__("./src/query.ts"),__webpack_require__("./src/subscription.ts");function _createMdxContent(props){const _components={code:"code",h1:"h1",h2:"h2",h3:"h3",p:"p",...(0,C_Users_Jameson_Source_AGI_aginterface_src_lib_zod2gql_node_modules_storybook_addon_docs_dist_shims_mdx_react_shim_mjs__WEBPACK_IMPORTED_MODULE_7__.R)(),...props.components};return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_2__.W8,{title:"Documentation/API Reference"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h1,{id:"api-reference",children:"API Reference"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p,{children:["Complete reference for the ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code,{children:"zod2gql"})," API, including types, methods, and configuration options."]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2,{id:"core-types",children:"Core Types"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3,{id:"gqltype-enum",children:"GQLType Enum"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_2__.kL,{language:"typescript",dark:!0,format:!0,code:"\nenum GQLType {\n  Query = 'query',\n  Mutation = 'mutation',\n  Subscription = 'subscription'\n}\n  "}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p,{children:["Used to specify the type of GraphQL operation when calling the ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code,{children:"toGQL"})," method."]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3,{id:"togqloptions-interface",children:"ToGQLOptions Interface"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_2__.kL,{language:"typescript",dark:!0,format:!0,code:"\ninterface ToGQLOptions {\n  operationName?: string;      // The name of the GraphQL operation\n  variables?: Record<string, any>; // Variables to include in the operation\n  maxDepth?: number;           // Maximum depth for nested fields (default: 10)\n  inputTypeMap?: Record<string, string>; // Map variable names to GraphQL input types\n}\n  "}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p,{children:"Configuration options for generating GraphQL operations."}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2,{id:"extension-methods",children:"Extension Methods"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3,{id:"togql",children:"toGQL"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_2__.kL,{language:"typescript",dark:!0,format:!0,code:"\n// Extension method added to ZodObject\ntoGQL(\n  queryType?: GQLType,      // Type of operation (Query, Mutation, Subscription)\n  options?: ToGQLOptions,   // Configuration options\n  depth?: number            // Current recursion depth (for internal use)\n): string;                  // Returns the GraphQL operation string\n  "}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p,{children:"The core method that generates a GraphQL operation string from a Zod schema."}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2,{id:"helper-functions",children:"Helper Functions"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3,{id:"createquery",children:"createQuery"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_2__.kL,{language:"typescript",dark:!0,format:!0,code:"\nfunction createQuery(\n  schema: z.ZodObject<any>,  // The Zod schema to convert\n  options?: ToGQLOptions     // Configuration options\n): string;                   // Returns the GraphQL query string\n  "}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p,{children:"Helper function to generate a GraphQL query."}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3,{id:"createmutation",children:"createMutation"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_2__.kL,{language:"typescript",dark:!0,format:!0,code:"\nfunction createMutation(\n  schema: z.ZodObject<any>,  // The Zod schema to convert\n  options?: ToGQLOptions     // Configuration options\n): string;                   // Returns the GraphQL mutation string\n  "}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p,{children:"Helper function to generate a GraphQL mutation."}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3,{id:"createsubscription",children:"createSubscription"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_2__.kL,{language:"typescript",dark:!0,format:!0,code:"\nfunction createSubscription(\n  schema: z.ZodObject<any>,  // The Zod schema to convert\n  options?: ToGQLOptions     // Configuration options\n): string;                   // Returns the GraphQL subscription string\n  "}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p,{children:"Helper function to generate a GraphQL subscription."}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2,{id:"utility-functions",children:"Utility Functions"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3,{id:"getoperationfieldname",children:"getOperationFieldName"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_2__.kL,{language:"typescript",dark:!0,format:!0,code:"\nfunction getOperationFieldName(\n  schema: z.ZodObject<any>,  // The Zod schema\n  operationName?: string     // Optional operation name to derive field name from\n): string;                   // Returns the inferred field name\n  "}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p,{children:"Utility function to infer a GraphQL field name from a schema or operation name."}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3,{id:"formatvariablesdeclaration",children:"formatVariablesDeclaration"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_2__.kL,{language:"typescript",dark:!0,format:!0,code:"\nfunction formatVariablesDeclaration(\n  variables?: Record<string, any>,  // Variables to format\n  inputTypeMap?: Record<string, string>  // Type mapping for variables\n): string;                           // Returns the formatted variables declaration\n  "}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p,{children:"Formats variables as GraphQL variable declarations."}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3,{id:"formatfieldarguments",children:"formatFieldArguments"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_2__.kL,{language:"typescript",dark:!0,format:!0,code:"\nfunction formatFieldArguments(\n  variables?: Record<string, any>  // Variables to format as field arguments\n): string;                         // Returns the formatted field arguments\n  "}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p,{children:"Formats variables as GraphQL field arguments."}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2,{id:"examples",children:"Examples"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3,{id:"basic-query",children:"Basic Query"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_2__.kL,{language:"typescript",dark:!0,format:!0,code:"\nimport { z } from 'zod';\nimport { createQuery } from 'zod2gql';\n\nconst userSchema = z.object({\n  id: z.string(),\n  name: z.string(),\n  email: z.string()\n});\n\nconst query = createQuery(userSchema, {\n  operationName: 'GetUser',\n  variables: { id: '123' }\n});\n\n// Result:\n// query GetUser($id: String!) {\n//   user(id: $id) {\n//     id\n//     name\n//     email\n//   }\n// }\n  "}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3,{id:"mutation-with-input-types",children:"Mutation with Input Types"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_2__.kL,{language:"typescript",dark:!0,format:!0,code:"\nimport { z } from 'zod';\nimport { createMutation } from 'zod2gql';\n\nconst userResponseSchema = z.object({\n  id: z.string(),\n  name: z.string(),\n  email: z.string()\n});\n\nconst mutation = createMutation(userResponseSchema, {\n  operationName: 'CreateUser',\n  variables: {\n    userData: { name: 'John', email: 'john@example.com' }\n  },\n  inputTypeMap: {\n    userData: 'UserInput'\n  }\n});\n\n// Result:\n// mutation CreateUser($userData: UserInput!) {\n//   createUser(userData: $userData) {\n//     id\n//     name\n//     email\n//   }\n// }\n  "}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3,{id:"subscription-with-depth-limit",children:"Subscription with Depth Limit"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_2__.kL,{language:"typescript",dark:!0,format:!0,code:"\nimport { z } from 'zod';\nimport { createSubscription } from 'zod2gql';\n\nconst notificationSchema = z.object({\n  id: z.string(),\n  message: z.string(),\n  user: z.object({\n    id: z.string(),\n    name: z.string(),\n    profile: z.object({\n      avatar: z.string(),\n      bio: z.string()\n    })\n  })\n});\n\nconst subscription = createSubscription(notificationSchema, {\n  operationName: 'SubscribeNotifications',\n  variables: { userId: '123' },\n  maxDepth: 3 // Limit nesting depth\n});\n\n// Result:\n// subscription SubscribeNotifications($userId: String!) {\n//   notifications(userId: $userId) {\n//     id\n//     message\n//     user {\n//       id\n//       name\n//       profile {\n//         avatar\n//         bio\n//       }\n//     }\n//   }\n// }\n  "}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3,{id:"using-togql-directly",children:"Using toGQL Directly"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_2__.kL,{language:"typescript",dark:!0,format:!0,code:"\nimport { z } from 'zod';\nimport { GQLType } from 'zod2gql';\nimport 'zod2gql/query'; // Import the extension\n\nconst userSchema = z.object({\n  id: z.string(),\n  name: z.string(),\n  email: z.string()\n});\n\nconst query = userSchema.toGQL(GQLType.Query, {\n  operationName: 'GetUser',\n  variables: { id: '123' }\n});\n\n// Result:\n// query GetUser($id: String!) {\n//   user(id: $id) {\n//     id\n//     name\n//     email\n//   }\n// }\n  "})]})}function MDXContent(props={}){const{wrapper:MDXLayout}={...(0,C_Users_Jameson_Source_AGI_aginterface_src_lib_zod2gql_node_modules_storybook_addon_docs_dist_shims_mdx_react_shim_mjs__WEBPACK_IMPORTED_MODULE_7__.R)(),...props.components};return MDXLayout?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(MDXLayout,{...props,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_createMdxContent,{...props})}):_createMdxContent(props)}},"./node_modules/@mdx-js/react/lib/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{R:()=>useMDXComponents,x:()=>MDXProvider});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/next/dist/compiled/react/index.js");const emptyComponents={},MDXContext=react__WEBPACK_IMPORTED_MODULE_0__.createContext(emptyComponents);function useMDXComponents(components){const contextComponents=react__WEBPACK_IMPORTED_MODULE_0__.useContext(MDXContext);return react__WEBPACK_IMPORTED_MODULE_0__.useMemo((function(){return"function"==typeof components?components(contextComponents):{...contextComponents,...components}}),[contextComponents,components])}function MDXProvider(properties){let allComponents;return allComponents=properties.disableParentContext?"function"==typeof properties.components?properties.components(emptyComponents):properties.components||emptyComponents:useMDXComponents(properties.components),react__WEBPACK_IMPORTED_MODULE_0__.createElement(MDXContext.Provider,{value:allComponents},properties.children)}},"./node_modules/@storybook/addon-docs/dist/index.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Hl:()=>_storybook_blocks__WEBPACK_IMPORTED_MODULE_4__.Hl,W8:()=>_storybook_blocks__WEBPACK_IMPORTED_MODULE_4__.W8,gG:()=>_storybook_blocks__WEBPACK_IMPORTED_MODULE_4__.gG,kL:()=>_storybook_blocks__WEBPACK_IMPORTED_MODULE_4__.kL});__webpack_require__("./node_modules/@storybook/addon-docs/dist/chunk-PRSJUHPQ.mjs"),__webpack_require__("./node_modules/@storybook/addon-docs/dist/chunk-NUUEMKO5.mjs"),__webpack_require__("./node_modules/@storybook/addon-docs/dist/chunk-H6MOWX77.mjs"),__webpack_require__("storybook/internal/preview-api");var _storybook_blocks__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/@storybook/blocks/dist/index.mjs")},"./node_modules/@storybook/blocks/dist sync recursive":module=>{function webpackEmptyContext(req){var e=new Error("Cannot find module '"+req+"'");throw e.code="MODULE_NOT_FOUND",e}webpackEmptyContext.keys=()=>[],webpackEmptyContext.resolve=webpackEmptyContext,webpackEmptyContext.id="./node_modules/@storybook/blocks/dist sync recursive",module.exports=webpackEmptyContext},"./node_modules/@storybook/core/dist/components sync recursive":module=>{function webpackEmptyContext(req){var e=new Error("Cannot find module '"+req+"'");throw e.code="MODULE_NOT_FOUND",e}webpackEmptyContext.keys=()=>[],webpackEmptyContext.resolve=webpackEmptyContext,webpackEmptyContext.id="./node_modules/@storybook/core/dist/components sync recursive",module.exports=webpackEmptyContext},"./node_modules/@storybook/core/dist/theming sync recursive":module=>{function webpackEmptyContext(req){var e=new Error("Cannot find module '"+req+"'");throw e.code="MODULE_NOT_FOUND",e}webpackEmptyContext.keys=()=>[],webpackEmptyContext.resolve=webpackEmptyContext,webpackEmptyContext.id="./node_modules/@storybook/core/dist/theming sync recursive",module.exports=webpackEmptyContext},"./src/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Hh:()=>formatVariablesDeclaration,Jf:()=>getOperationFieldName,Nt:()=>GQLType,ON:()=>formatFieldArguments,fO:()=>processFields});var zod__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/zod/lib/index.mjs"),_mutation__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/mutation.ts"),_query__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/query.ts"),_subscription__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/subscription.ts"),GQLType=function(GQLType){return GQLType.Query="query",GQLType.Mutation="mutation",GQLType.Subscription="subscription",GQLType}({});const getOperationFieldName=(schema,operationName)=>{if(operationName){let fieldName=operationName;const prefixes=["Get","Create","Update","Delete","Subscribe"];for(const prefix of prefixes)if(fieldName.startsWith(prefix)){fieldName=fieldName.substring(prefix.length);break}return fieldName.charAt(0).toLowerCase()+fieldName.slice(1)}{const typeName=schema._def.typeName||"";return typeName?typeName.charAt(0).toLowerCase()+typeName.slice(1):""}},formatVariablesDeclaration=(variables,inputTypeMap)=>variables&&0!==Object.keys(variables).length?`(${Object.entries(variables).map((([key,value])=>{if(inputTypeMap&&inputTypeMap[key])return`$${key}: ${inputTypeMap[key]}!`;let type="String";return"number"==typeof value&&(type="Int"),"boolean"==typeof value&&(type="Boolean"),"object"==typeof value&&null!==value&&(type=`${key.charAt(0).toUpperCase()+key.slice(1)}Input`),`$${key}: ${type}!`})).join(", ")})`:"",formatFieldArguments=variables=>variables&&0!==Object.keys(variables).length?`(${Object.entries(variables).map((([key])=>`${key}: $${key}`)).join(", ")})`:"",processFields=(schema,queryType,options={},depth=0)=>{const{maxDepth=10}=options;if(depth>maxDepth)return"";const indent="  ".repeat(depth);let query="";const shape=schema._def.shape();for(const[key,value]of Object.entries(shape)){const processSchema=(schema,fieldName)=>{if(schema instanceof zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodObject)query+=`${indent}${fieldName} {\n${processFields(schema,queryType,options,depth+1)}${indent}}\n`;else if(schema instanceof zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodArray){const elementType=schema._def.type;elementType&&"object"==typeof elementType&&"toJSON"in elementType?processSchema(elementType,fieldName):query+=`${indent}${fieldName}\n`}else if(schema instanceof zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodLazy){const innerType=schema._def.getter();innerType&&"object"==typeof innerType&&"toJSON"in innerType?processSchema(innerType,fieldName):query+=`${indent}${fieldName}\n`}else if(schema instanceof zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodOptional||schema instanceof zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodNullable){const innerType=schema._def.innerType;innerType&&"object"==typeof innerType&&"toJSON"in innerType?processSchema(innerType,fieldName):query+=`${indent}${fieldName}\n`}else schema instanceof zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodUnion||zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodEnum,query+=`${indent}${fieldName}\n`};value&&"object"==typeof value&&"toJSON"in value?processSchema(value,key):query+=`${indent}${key}\n`}return query};zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodObject.prototype.toGQL=function(queryType="query",options={},depth=0){if(depth>0)return processFields(this,queryType,options,depth);switch(queryType){case"query":return(0,_query__WEBPACK_IMPORTED_MODULE_1__.O)(this,options);case"mutation":return(0,_mutation__WEBPACK_IMPORTED_MODULE_0__.n)(this,options);case"subscription":return(0,_subscription__WEBPACK_IMPORTED_MODULE_2__.d)(this,options);default:return""}}},"./src/mutation.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{W:()=>createMutation,n:()=>processMutation});var _index__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/index.ts");function processMutation(schema,options={}){const{operationName,variables,maxDepth=10,inputTypeMap}=options,operation=operationName?` ${operationName}`:"",varsString=((variables,inputTypeMap)=>variables&&0!==Object.keys(variables).length?`(${Object.entries(variables).map((([key,value])=>{if(inputTypeMap&&inputTypeMap[key])return`$${key}: ${inputTypeMap[key]}!`;let type="String";return"number"==typeof value?type="Int":"boolean"==typeof value?type="Boolean":"object"==typeof value&&null!==value&&(type=`${key.charAt(0).toUpperCase()+key.slice(1)}Input`),`$${key}: ${type}!`})).join(", ")})`:"")(variables,inputTypeMap),fieldArgs=(0,_index__WEBPACK_IMPORTED_MODULE_0__.ON)(variables),mutationField=(0,_index__WEBPACK_IMPORTED_MODULE_0__.Jf)(schema,operationName);return`${_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Mutation}${operation}${varsString} {\n  ${mutationField}${fieldArgs} {\n${(0,_index__WEBPACK_IMPORTED_MODULE_0__.fO)(schema,_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Mutation,options,2)}  }\n}`}function createMutation(schema,options={}){return schema.toGQL(_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Mutation,options)}},"./src/query.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{O:()=>processQuery,V:()=>createQuery});var _index__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/index.ts");function processQuery(schema,options={}){const{operationName,variables,maxDepth=10}=options,operation=operationName?` ${operationName}`:"",varsString=(0,_index__WEBPACK_IMPORTED_MODULE_0__.Hh)(variables,options.inputTypeMap),fieldArgs=(0,_index__WEBPACK_IMPORTED_MODULE_0__.ON)(variables),queryField=(0,_index__WEBPACK_IMPORTED_MODULE_0__.Jf)(schema,operationName);return`${_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Query}${operation}${varsString} {\n  ${queryField}${fieldArgs} {\n${(0,_index__WEBPACK_IMPORTED_MODULE_0__.fO)(schema,_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Query,options,2)}  }\n}`}function createQuery(schema,options={}){return schema.toGQL(_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Query,options)}},"./src/subscription.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{K:()=>createSubscription,d:()=>processSubscription});var _index__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/index.ts");function processSubscription(schema,options={}){const{operationName,variables,maxDepth=10}=options,operation=operationName?` ${operationName}`:"",varsString=(0,_index__WEBPACK_IMPORTED_MODULE_0__.Hh)(variables,options.inputTypeMap),fieldArgs=(0,_index__WEBPACK_IMPORTED_MODULE_0__.ON)(variables),subscriptionField=(0,_index__WEBPACK_IMPORTED_MODULE_0__.Jf)(schema,operationName);return`${_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Subscription}${operation}${varsString} {\n  ${subscriptionField}${fieldArgs} {\n${(0,_index__WEBPACK_IMPORTED_MODULE_0__.fO)(schema,_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Subscription,options,2)}  }\n}`}function createSubscription(schema,options={}){return schema.toGQL(_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Subscription,options)}}}]);