"use strict";(self.webpackChunkzod2gql=self.webpackChunkzod2gql||[]).push([[453],{"./src/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Hh:()=>formatVariablesDeclaration,Jf:()=>getOperationFieldName,Nt:()=>GQLType,ON:()=>formatFieldArguments,fO:()=>processFields});var zod__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/zod/lib/index.mjs"),_mutation__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/mutation.ts"),_query__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/query.ts"),_subscription__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/subscription.ts"),GQLType=function(GQLType){return GQLType.Query="query",GQLType.Mutation="mutation",GQLType.Subscription="subscription",GQLType}({});const getOperationFieldName=(schema,operationName,isArray=!1)=>{let fieldName="";if(operationName){fieldName=operationName;const prefixes=["Get","Create","Update","Delete","Subscribe"];for(const prefix of prefixes)if(fieldName.startsWith(prefix)){fieldName=fieldName.substring(prefix.length);break}fieldName=fieldName.charAt(0).toLowerCase()+fieldName.slice(1)}else if(schema instanceof zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodArray){const elementSchema=schema._def.type;elementSchema instanceof zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodObject&&(fieldName=getOperationFieldName(elementSchema),isArray=!0)}else if(schema instanceof zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodObject)if(schema.description)fieldName=schema.description.charAt(0).toLowerCase()+schema.description.slice(1);else{const typeName=schema._def.typeName||"";typeName&&"ZodObject"!==typeName&&(fieldName=typeName.charAt(0).toLowerCase()+typeName.slice(1))}return isArray?(word=fieldName)?word.endsWith("y")?word.slice(0,-1)+"ies":word.endsWith("s")||word.endsWith("x")||word.endsWith("ch")||word.endsWith("sh")?word+"es":word+"s":"":fieldName;var word},formatVariablesDeclaration=(variables,inputTypeMap)=>variables&&0!==Object.keys(variables).length?`(${Object.entries(variables).map((([key,value])=>{if(inputTypeMap&&inputTypeMap[key])return`$${key}: ${inputTypeMap[key]}!`;const inferType=val=>{if(null===val)return"String";if(Array.isArray(val)){return`[${val.length>0?inferType(val[0]):"String"}]`}switch(typeof val){case"number":return Number.isInteger(val)?"Int":"Float";case"boolean":return"Boolean";case"object":return`${key.charAt(0).toUpperCase()+key.slice(1)}Input`;default:return"String"}};return`$${key}: ${inferType(value)}!`})).join(", ")})`:"",formatFieldArguments=variables=>variables&&0!==Object.keys(variables).length?`(${Object.entries(variables).map((([key])=>`${key}: $${key}`)).join(", ")})`:"",processFields=(schema,queryType,options={},depth=0)=>{const{maxDepth=10}=options;if(depth>maxDepth)return"";const indent="  ".repeat(depth);let query="";const shape=schema._def.shape();for(const[key,value]of Object.entries(shape)){const processSchema=(schema,fieldName)=>{const unwrappedSchema=schema instanceof zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodOptional||schema instanceof zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodNullable?schema._def.innerType:schema;if(unwrappedSchema instanceof zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodObject)query+=`${indent}${fieldName} {\n${processFields(unwrappedSchema,queryType,options,depth+1)}${indent}}\n`;else if(unwrappedSchema instanceof zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodArray){const elementType=unwrappedSchema._def.type;elementType instanceof zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodObject?query+=`${indent}${fieldName} {\n${processFields(elementType,queryType,options,depth+1)}${indent}}\n`:query+=`${indent}${fieldName}\n`}else query+=`${indent}${fieldName}\n`};value instanceof zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodType?processSchema(value,key):query+=`${indent}${key}\n`}return query};zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodObject.prototype.toGQL=function(queryType="query",options={},depth=0){if(depth>0)return processFields(this,queryType,options,depth);switch(queryType){case"query":return(0,_query__WEBPACK_IMPORTED_MODULE_1__.O)(this,options);case"mutation":return(0,_mutation__WEBPACK_IMPORTED_MODULE_0__.n)(this,options);case"subscription":return(0,_subscription__WEBPACK_IMPORTED_MODULE_2__.d)(this,options);default:return""}},zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodArray.prototype.toGQL=function(queryType="query",options={},depth=0){if(depth>0)return"";if(!(this._def.type instanceof zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodObject))throw new Error("Array element must be a ZodObject for toGQL");switch(queryType){case"query":return function processArrayQuery(schema,options={}){const{operationName,variables,maxDepth=10}=options,elementSchema=schema._def.type;if(!(elementSchema instanceof zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodObject))throw new Error("Array element must be a ZodObject");const operation=operationName?` ${operationName}`:"",varsString=formatVariablesDeclaration(variables,options.inputTypeMap),fieldArgs=formatFieldArguments(variables);return`query${operation}${varsString} {\n  ${getOperationFieldName(schema,operationName)}${fieldArgs} {\n${processFields(elementSchema,"query",options,2)}  }\n}`}(this,options);case"mutation":return function processArrayMutation(schema,options={}){const{operationName,variables,maxDepth=10}=options,elementSchema=schema._def.type;if(!(elementSchema instanceof zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodObject))throw new Error("Array element must be a ZodObject");const operation=operationName?` ${operationName}`:"",varsString=formatVariablesDeclaration(variables,options.inputTypeMap),fieldArgs=formatFieldArguments(variables);return`mutation${operation}${varsString} {\n  ${getOperationFieldName(schema,operationName)}${fieldArgs} {\n${processFields(elementSchema,"mutation",options,2)}  }\n}`}(this,options);case"subscription":return function processArraySubscription(schema,options={}){const{operationName,variables,maxDepth=10}=options,elementSchema=schema._def.type;if(!(elementSchema instanceof zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodObject))throw new Error("Array element must be a ZodObject");const operation=operationName?` ${operationName}`:"",varsString=formatVariablesDeclaration(variables,options.inputTypeMap),fieldArgs=formatFieldArguments(variables);return`subscription${operation}${varsString} {\n  ${getOperationFieldName(schema,operationName)}${fieldArgs} {\n${processFields(elementSchema,"subscription",options,2)}  }\n}`}(this,options);default:return""}}},"./src/mutation.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{W:()=>createMutation,n:()=>processMutation});var _index__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/index.ts");function processMutation(schema,options={}){const{operationName,variables,maxDepth=10,inputTypeMap}=options,operation=operationName?` ${operationName}`:"",varsString=((variables,inputTypeMap)=>variables&&0!==Object.keys(variables).length?`(${Object.entries(variables).map((([key,value])=>{if(inputTypeMap&&inputTypeMap[key])return`$${key}: ${inputTypeMap[key]}!`;let type="String";return"number"==typeof value?type="Int":"boolean"==typeof value?type="Boolean":"object"==typeof value&&null!==value&&(type=`${key.charAt(0).toUpperCase()+key.slice(1)}Input`),`$${key}: ${type}!`})).join(", ")})`:"")(variables,inputTypeMap),fieldArgs=(0,_index__WEBPACK_IMPORTED_MODULE_0__.ON)(variables),mutationField=(0,_index__WEBPACK_IMPORTED_MODULE_0__.Jf)(schema,operationName);return`${_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Mutation}${operation}${varsString} {\n  ${mutationField}${fieldArgs} {\n${(0,_index__WEBPACK_IMPORTED_MODULE_0__.fO)(schema,_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Mutation,options,2)}  }\n}`}function createMutation(schema,options={}){return schema.toGQL(_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Mutation,options)}},"./src/query.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{ComplexOrderQuery:()=>ComplexOrderQuery,EmployeeWithCircularReferencesQuery:()=>EmployeeWithCircularReferencesQuery,GetPostsArrayQuery:()=>GetPostsArrayQuery,GetUsersExplicitNameQuery:()=>GetUsersExplicitNameQuery,InferredQueryOperation:()=>InferredQueryOperation,MaxDepth1Query:()=>MaxDepth1Query,MediaQuery:()=>MediaQuery,NestedCommentsQuery:()=>NestedCommentsQuery,PostWithCommentsQuery:()=>PostWithCommentsQuery,ProductWithCircularReferencesQuery:()=>ProductWithCircularReferencesQuery,SimpleQuery:()=>SimpleQuery,UsersArrayQuery:()=>UsersArrayQuery,VeryShallowQuery:()=>VeryShallowQuery,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/next/dist/compiled/react/jsx-runtime.js"),_storybook_test__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@storybook/test/dist/index.mjs"),zod__WEBPACK_IMPORTED_MODULE_5__=(__webpack_require__("./node_modules/next/dist/compiled/react/index.js"),__webpack_require__("./node_modules/zod/lib/index.mjs")),_index__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/index.ts"),_query__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/query.ts");const withTypeName=(schema,name)=>(schema._def.typeName=name,schema),__WEBPACK_DEFAULT_EXPORT__={title:"GraphQL/Query",component:({schema,options,expectedOutput})=>{const query="function"==typeof schema.toGQL?schema.toGQL(_index__WEBPACK_IMPORTED_MODULE_3__.Nt.Query,options):(0,_query__WEBPACK_IMPORTED_MODULE_4__.V)(schema,options);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3",{children:"Generated GraphQL Query"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("pre",{"data-testid":"query-output",children:query}),expectedOutput&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3",{children:"Expected Output"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("pre",{"data-testid":"expected-output",children:expectedOutput})]})]})},parameters:{docs:{description:{component:"Generate GraphQL queries from Zod schemas. See the [Queries documentation](/?path=/docs/documentation-queries--docs) for more details."},source:{type:"dynamic",excludeDecorators:!0}}}},addressSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({street:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),city:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),state:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),zipCode:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),country:zod__WEBPACK_IMPORTED_MODULE_5__.z.string().optional()}),"Address"),userSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({id:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),name:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),email:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),age:zod__WEBPACK_IMPORTED_MODULE_5__.z.number(),isActive:zod__WEBPACK_IMPORTED_MODULE_5__.z.boolean(),address:addressSchema.optional()}),"User"),commentSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({id:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),text:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),author:userSchema,createdAt:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),likes:zod__WEBPACK_IMPORTED_MODULE_5__.z.number(),replies:zod__WEBPACK_IMPORTED_MODULE_5__.z.array(zod__WEBPACK_IMPORTED_MODULE_5__.z.lazy((()=>commentSchema))).optional()}),"Comment"),postSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({id:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),title:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),content:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),author:userSchema,comments:zod__WEBPACK_IMPORTED_MODULE_5__.z.array(commentSchema),tags:zod__WEBPACK_IMPORTED_MODULE_5__.z.array(zod__WEBPACK_IMPORTED_MODULE_5__.z.string()),createdAt:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),updatedAt:zod__WEBPACK_IMPORTED_MODULE_5__.z.string().optional()}),"Post"),permissionSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({id:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),name:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),description:zod__WEBPACK_IMPORTED_MODULE_5__.z.string().optional()}),"Permission"),roleSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({id:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),name:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),permissions:zod__WEBPACK_IMPORTED_MODULE_5__.z.array(permissionSchema)}),"Role"),departmentSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({id:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),name:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),description:zod__WEBPACK_IMPORTED_MODULE_5__.z.string().optional()}),"Department"),employeeSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({id:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),name:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),email:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),department:departmentSchema,supervisor:zod__WEBPACK_IMPORTED_MODULE_5__.z.lazy((()=>employeeSchema)).optional(),subordinates:zod__WEBPACK_IMPORTED_MODULE_5__.z.array(zod__WEBPACK_IMPORTED_MODULE_5__.z.lazy((()=>employeeSchema))).optional(),roles:zod__WEBPACK_IMPORTED_MODULE_5__.z.array(roleSchema),address:addressSchema,hireDate:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),salary:zod__WEBPACK_IMPORTED_MODULE_5__.z.number()}),"Employee"),categorySchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({id:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),name:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),description:zod__WEBPACK_IMPORTED_MODULE_5__.z.string().optional(),parentCategory:zod__WEBPACK_IMPORTED_MODULE_5__.z.lazy((()=>categorySchema)).optional(),subcategories:zod__WEBPACK_IMPORTED_MODULE_5__.z.array(zod__WEBPACK_IMPORTED_MODULE_5__.z.lazy((()=>categorySchema))).optional()}),"Category"),productSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({id:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),name:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),description:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),price:zod__WEBPACK_IMPORTED_MODULE_5__.z.number(),category:categorySchema,relatedProducts:zod__WEBPACK_IMPORTED_MODULE_5__.z.array(zod__WEBPACK_IMPORTED_MODULE_5__.z.lazy((()=>productSchema))).optional(),attributes:zod__WEBPACK_IMPORTED_MODULE_5__.z.record(zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),zod__WEBPACK_IMPORTED_MODULE_5__.z.union([zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),zod__WEBPACK_IMPORTED_MODULE_5__.z.number(),zod__WEBPACK_IMPORTED_MODULE_5__.z.boolean()])),stockQuantity:zod__WEBPACK_IMPORTED_MODULE_5__.z.number(),isAvailable:zod__WEBPACK_IMPORTED_MODULE_5__.z.boolean()}),"Product"),orderItemSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({id:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),product:productSchema,quantity:zod__WEBPACK_IMPORTED_MODULE_5__.z.number(),unitPrice:zod__WEBPACK_IMPORTED_MODULE_5__.z.number(),totalPrice:zod__WEBPACK_IMPORTED_MODULE_5__.z.number()}),"OrderItem"),orderSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({id:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),customer:userSchema,items:zod__WEBPACK_IMPORTED_MODULE_5__.z.array(orderItemSchema),totalAmount:zod__WEBPACK_IMPORTED_MODULE_5__.z.number(),status:zod__WEBPACK_IMPORTED_MODULE_5__.z.enum(["pending","processing","shipped","delivered","cancelled"]),shippingAddress:addressSchema,billingAddress:addressSchema,createdAt:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),updatedAt:zod__WEBPACK_IMPORTED_MODULE_5__.z.string().optional(),relatedOrders:zod__WEBPACK_IMPORTED_MODULE_5__.z.array(zod__WEBPACK_IMPORTED_MODULE_5__.z.lazy((()=>orderSchema))).optional()}),"Order"),mediaTypeEnum=zod__WEBPACK_IMPORTED_MODULE_5__.z.enum(["image","video","document"]),imageSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({url:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),width:zod__WEBPACK_IMPORTED_MODULE_5__.z.number(),height:zod__WEBPACK_IMPORTED_MODULE_5__.z.number(),format:zod__WEBPACK_IMPORTED_MODULE_5__.z.string()}),"Image"),videoSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({url:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),duration:zod__WEBPACK_IMPORTED_MODULE_5__.z.number(),format:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),thumbnail:imageSchema.optional()}),"Video"),documentSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({url:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),title:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),fileSize:zod__WEBPACK_IMPORTED_MODULE_5__.z.number(),fileType:zod__WEBPACK_IMPORTED_MODULE_5__.z.string()}),"Document"),mediaSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({id:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),type:mediaTypeEnum,title:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),description:zod__WEBPACK_IMPORTED_MODULE_5__.z.string().optional(),image:imageSchema.optional(),video:videoSchema.optional(),document:documentSchema.optional(),uploadedBy:userSchema,uploadedAt:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),tags:zod__WEBPACK_IMPORTED_MODULE_5__.z.array(zod__WEBPACK_IMPORTED_MODULE_5__.z.string()).optional()}),"Media"),SimpleQuery={args:{schema:userSchema,options:{operationName:"GetUser",variables:{id:"123"}},expectedOutput:"query GetUser($id: String!) {\n  user(id: $id) {\n    id\n    name\n    email\n    age\n    isActive\n    address {\n      street\n      city\n      state\n      zipCode\n      country\n    }\n  }\n}"},parameters:{docs:{description:{story:"A simple GraphQL query with explicit operation name and variables."},source:{type:"code"}}},play:async({canvasElement})=>{const canvas=(0,_storybook_test__WEBPACK_IMPORTED_MODULE_1__.ux)(canvasElement),queryOutput=canvas.getByTestId("query-output"),expectedOutput=canvas.getByTestId("expected-output"),normalizeString=str=>str.replace(/\s+/g,"");(0,_storybook_test__WEBPACK_IMPORTED_MODULE_1__.E3)(normalizeString(queryOutput.textContent||"")).toBe(normalizeString(expectedOutput.textContent||""))}},UsersArrayQuery={args:{schema:zod__WEBPACK_IMPORTED_MODULE_5__.z.array(userSchema),options:{variables:{limit:10,offset:0}},expectedOutput:"query($limit: Int!, $offset: Int!) {\n  users(limit: $limit, offset: $offset) {\n    id\n    name\n    email\n    age\n    isActive\n    address {\n      street\n      city\n      state\n      zipCode\n      country\n    }\n  }\n}"},parameters:{docs:{description:{story:"A query using array schema for automatic pluralization of the field name."},source:{type:"code"}}}},GetUsersExplicitNameQuery={args:{schema:zod__WEBPACK_IMPORTED_MODULE_5__.z.array(userSchema),options:{operationName:"GetUsers",variables:{limit:10,offset:0}},expectedOutput:"query GetUsers($limit: Int!, $offset: Int!) {\n  users(limit: $limit, offset: $offset) {\n    id\n    name\n    email\n    age\n    isActive\n    address {\n      street\n      city\n      state\n      zipCode\n      country\n    }\n  }\n}"},parameters:{docs:{description:{story:"An array query with an explicit operation name and automatic field name pluralization."},source:{type:"code"}}}},GetPostsArrayQuery={args:{schema:zod__WEBPACK_IMPORTED_MODULE_5__.z.array(postSchema),options:{variables:{userId:"user123",limit:5}},expectedOutput:"query($userId: String!, $limit: Int!) {\n  posts(userId: $userId, limit: $limit) {\n    id\n    title\n    content\n    author {\n      id\n      name\n      email\n      age\n      isActive\n      address {\n        street\n        city\n        state\n        zipCode\n        country\n      }\n    }\n    comments {\n      id\n      text\n      author {\n        id\n        name\n        email\n        age\n        isActive\n        address {\n          street\n          city\n          state\n          zipCode\n          country\n        }\n      }\n      createdAt\n      likes\n      replies {\n        id\n        text\n        author {\n          id\n          name\n          email\n          age\n          isActive\n          address {\n            street\n            city\n            state\n            zipCode\n            country\n          }\n        }\n        createdAt\n        likes\n        replies\n      }\n    }\n    tags\n    createdAt\n    updatedAt\n  }\n}"},parameters:{docs:{description:{story:"A complex query using array schema with nested objects and automatic pluralization."},source:{type:"code"}}}},NestedCommentsQuery={args:{schema:commentSchema,options:{operationName:"GetComment",variables:{id:"comment123"}},expectedOutput:"query GetComment($id: String!) {\n  comment(id: $id) {\n    id\n    text\n    author {\n      id\n      name\n      email\n      age\n      isActive\n      address {\n        street\n        city\n        state\n        zipCode\n        country\n      }\n    }\n    createdAt\n    likes\n    replies {\n      id\n      text\n      author {\n        id\n        name\n        email\n        age\n        isActive\n        address {\n          street\n          city\n          state\n          zipCode\n          country\n        }\n      }\n      createdAt\n      likes\n      replies\n    }\n  }\n}"},parameters:{docs:{description:{story:"A nested GraphQL query for comments with multiple levels of nested data structures including circular references."},source:{type:"code"}}}},PostWithCommentsQuery={args:{schema:postSchema,options:{operationName:"GetPost",variables:{id:"post123"}},expectedOutput:"query GetPost($id: String!) {\n  post(id: $id) {\n    id\n    title\n    content\n    author {\n      id\n      name\n      email\n      age\n      isActive\n      address {\n        street\n        city\n        state\n        zipCode\n        country\n      }\n    }\n    comments {\n      id\n      text\n      author {\n        id\n        name\n        email\n        age\n        isActive\n        address {\n          street\n          city\n          state\n          zipCode\n          country\n        }\n      }\n      createdAt\n      likes\n      replies {\n        id\n        text\n        author {\n          id\n          name\n          email\n          age\n          isActive\n          address {\n            street\n            city\n            state\n            zipCode\n            country\n          }\n        }\n        createdAt\n        likes\n        replies\n      }\n    }\n    tags\n    createdAt\n    updatedAt\n  }\n}"}},EmployeeWithCircularReferencesQuery={args:{schema:employeeSchema,options:{operationName:"GetEmployee",variables:{id:"emp123"}},expectedOutput:"query GetEmployee($id: String!) {\n  employee(id: $id) {\n    id\n    name\n    email\n    department {\n      id\n      name\n      description\n    }\n    supervisor {\n      id\n      name\n      email\n      department {\n        id\n        name\n        description\n      }\n      supervisor\n      subordinates\n      roles {\n        id\n        name\n        permissions {\n          id\n          name\n          description\n        }\n      }\n      address {\n        street\n        city\n        state\n        zipCode\n        country\n      }\n      hireDate\n      salary\n    }\n    subordinates {\n      id\n      name\n      email\n      department {\n        id\n        name\n        description\n      }\n      supervisor\n      subordinates\n      roles {\n        id\n        name\n        permissions {\n          id\n          name\n          description\n        }\n      }\n      address {\n        street\n        city\n        state\n        zipCode\n        country\n      }\n      hireDate\n      salary\n    }\n    roles {\n      id\n      name\n      permissions {\n        id\n        name\n        description\n      }\n    }\n    address {\n      street\n      city\n      state\n      zipCode\n      country\n    }\n    hireDate\n    salary\n  }\n}"}},ProductWithCircularReferencesQuery={args:{schema:productSchema,options:{operationName:"GetProduct",variables:{id:"prod123"}}}},ComplexOrderQuery={args:{schema:orderSchema,options:{operationName:"GetOrder",variables:{id:"order123"}}}},MediaQuery={args:{schema:mediaSchema,options:{operationName:"GetMedia",variables:{id:"media123"}}}},InferredQueryOperation={args:{schema:userSchema,options:{variables:{id:"123"}},expectedOutput:"query($id: String!) {\n  user(id: $id) {\n    id\n    name\n    email\n    age\n    isActive\n    address {\n      street\n      city\n      state\n      zipCode\n      country\n    }\n  }\n}"}},MaxDepth1Query={args:{schema:postSchema,options:{operationName:"GetPostLimitedDepth",variables:{id:"post123"},maxDepth:3},expectedOutput:"query GetPostLimitedDepth($id: String!) {\n  post(id: $id) {\n    id\n    title\n    content\n    author {\n      id\n      name\n      email\n      age\n      isActive\n      address\n    }\n    comments {\n      id\n      text\n      author\n      createdAt\n      likes\n      replies\n    }\n    tags\n    createdAt\n    updatedAt\n  }\n}"}},VeryShallowQuery={args:{schema:orderSchema,options:{operationName:"GetOrderShallow",variables:{id:"order123"},maxDepth:2},expectedOutput:"query GetOrderShallow($id: String!) {\n  order(id: $id) {\n    id\n    customer\n    items\n    totalAmount\n    status\n    shippingAddress\n    billingAddress\n    createdAt\n    updatedAt\n    relatedOrders\n  }\n}"}},__namedExportsOrder=["SimpleQuery","UsersArrayQuery","GetUsersExplicitNameQuery","GetPostsArrayQuery","NestedCommentsQuery","PostWithCommentsQuery","EmployeeWithCircularReferencesQuery","ProductWithCircularReferencesQuery","ComplexOrderQuery","MediaQuery","InferredQueryOperation","MaxDepth1Query","VeryShallowQuery"];SimpleQuery.parameters={...SimpleQuery.parameters,docs:{...SimpleQuery.parameters?.docs,source:{originalSource:"{\n  args: {\n    schema: userSchema,\n    options: {\n      operationName: 'GetUser',\n      variables: {\n        id: '123'\n      }\n    },\n    expectedOutput: `query GetUser($id: String!) {\n  user(id: $id) {\n    id\n    name\n    email\n    age\n    isActive\n    address {\n      street\n      city\n      state\n      zipCode\n      country\n    }\n  }\n}`\n  },\n  parameters: {\n    docs: {\n      description: {\n        story: 'A simple GraphQL query with explicit operation name and variables.'\n      },\n      source: {\n        type: 'code'\n      }\n    }\n  },\n  play: async ({\n    canvasElement\n  }) => {\n    const canvas = within(canvasElement);\n\n    // Get the generated output\n    const queryOutput = canvas.getByTestId('query-output');\n    const expectedOutput = canvas.getByTestId('expected-output');\n\n    // Normalize strings (remove whitespace) for comparison\n    const normalizeString = (str: string) => str.replace(/\\s+/g, '');\n    expect(normalizeString(queryOutput.textContent || '')).toBe(normalizeString(expectedOutput.textContent || ''));\n  }\n}",...SimpleQuery.parameters?.docs?.source}}},UsersArrayQuery.parameters={...UsersArrayQuery.parameters,docs:{...UsersArrayQuery.parameters?.docs,source:{originalSource:"{\n  args: {\n    schema: z.array(userSchema),\n    options: {\n      variables: {\n        limit: 10,\n        offset: 0\n      }\n    },\n    expectedOutput: `query($limit: Int!, $offset: Int!) {\n  users(limit: $limit, offset: $offset) {\n    id\n    name\n    email\n    age\n    isActive\n    address {\n      street\n      city\n      state\n      zipCode\n      country\n    }\n  }\n}`\n  },\n  parameters: {\n    docs: {\n      description: {\n        story: 'A query using array schema for automatic pluralization of the field name.'\n      },\n      source: {\n        type: 'code'\n      }\n    }\n  }\n}",...UsersArrayQuery.parameters?.docs?.source}}},GetUsersExplicitNameQuery.parameters={...GetUsersExplicitNameQuery.parameters,docs:{...GetUsersExplicitNameQuery.parameters?.docs,source:{originalSource:"{\n  args: {\n    schema: z.array(userSchema),\n    options: {\n      operationName: 'GetUsers',\n      variables: {\n        limit: 10,\n        offset: 0\n      }\n    },\n    expectedOutput: `query GetUsers($limit: Int!, $offset: Int!) {\n  users(limit: $limit, offset: $offset) {\n    id\n    name\n    email\n    age\n    isActive\n    address {\n      street\n      city\n      state\n      zipCode\n      country\n    }\n  }\n}`\n  },\n  parameters: {\n    docs: {\n      description: {\n        story: 'An array query with an explicit operation name and automatic field name pluralization.'\n      },\n      source: {\n        type: 'code'\n      }\n    }\n  }\n}",...GetUsersExplicitNameQuery.parameters?.docs?.source}}},GetPostsArrayQuery.parameters={...GetPostsArrayQuery.parameters,docs:{...GetPostsArrayQuery.parameters?.docs,source:{originalSource:"{\n  args: {\n    schema: z.array(postSchema),\n    options: {\n      variables: {\n        userId: 'user123',\n        limit: 5\n      }\n    },\n    expectedOutput: `query($userId: String!, $limit: Int!) {\n  posts(userId: $userId, limit: $limit) {\n    id\n    title\n    content\n    author {\n      id\n      name\n      email\n      age\n      isActive\n      address {\n        street\n        city\n        state\n        zipCode\n        country\n      }\n    }\n    comments {\n      id\n      text\n      author {\n        id\n        name\n        email\n        age\n        isActive\n        address {\n          street\n          city\n          state\n          zipCode\n          country\n        }\n      }\n      createdAt\n      likes\n      replies {\n        id\n        text\n        author {\n          id\n          name\n          email\n          age\n          isActive\n          address {\n            street\n            city\n            state\n            zipCode\n            country\n          }\n        }\n        createdAt\n        likes\n        replies\n      }\n    }\n    tags\n    createdAt\n    updatedAt\n  }\n}`\n  },\n  parameters: {\n    docs: {\n      description: {\n        story: 'A complex query using array schema with nested objects and automatic pluralization.'\n      },\n      source: {\n        type: 'code'\n      }\n    }\n  }\n}",...GetPostsArrayQuery.parameters?.docs?.source}}},NestedCommentsQuery.parameters={...NestedCommentsQuery.parameters,docs:{...NestedCommentsQuery.parameters?.docs,source:{originalSource:"{\n  args: {\n    schema: commentSchema,\n    options: {\n      operationName: 'GetComment',\n      variables: {\n        id: 'comment123'\n      }\n    },\n    expectedOutput: `query GetComment($id: String!) {\n  comment(id: $id) {\n    id\n    text\n    author {\n      id\n      name\n      email\n      age\n      isActive\n      address {\n        street\n        city\n        state\n        zipCode\n        country\n      }\n    }\n    createdAt\n    likes\n    replies {\n      id\n      text\n      author {\n        id\n        name\n        email\n        age\n        isActive\n        address {\n          street\n          city\n          state\n          zipCode\n          country\n        }\n      }\n      createdAt\n      likes\n      replies\n    }\n  }\n}`\n  },\n  parameters: {\n    docs: {\n      description: {\n        story: 'A nested GraphQL query for comments with multiple levels of nested data structures including circular references.'\n      },\n      source: {\n        type: 'code'\n      }\n    }\n  }\n}",...NestedCommentsQuery.parameters?.docs?.source}}},PostWithCommentsQuery.parameters={...PostWithCommentsQuery.parameters,docs:{...PostWithCommentsQuery.parameters?.docs,source:{originalSource:"{\n  args: {\n    schema: postSchema,\n    options: {\n      operationName: 'GetPost',\n      variables: {\n        id: 'post123'\n      }\n    },\n    expectedOutput: `query GetPost($id: String!) {\n  post(id: $id) {\n    id\n    title\n    content\n    author {\n      id\n      name\n      email\n      age\n      isActive\n      address {\n        street\n        city\n        state\n        zipCode\n        country\n      }\n    }\n    comments {\n      id\n      text\n      author {\n        id\n        name\n        email\n        age\n        isActive\n        address {\n          street\n          city\n          state\n          zipCode\n          country\n        }\n      }\n      createdAt\n      likes\n      replies {\n        id\n        text\n        author {\n          id\n          name\n          email\n          age\n          isActive\n          address {\n            street\n            city\n            state\n            zipCode\n            country\n          }\n        }\n        createdAt\n        likes\n        replies\n      }\n    }\n    tags\n    createdAt\n    updatedAt\n  }\n}`\n  }\n}",...PostWithCommentsQuery.parameters?.docs?.source}}},EmployeeWithCircularReferencesQuery.parameters={...EmployeeWithCircularReferencesQuery.parameters,docs:{...EmployeeWithCircularReferencesQuery.parameters?.docs,source:{originalSource:"{\n  args: {\n    schema: employeeSchema,\n    options: {\n      operationName: 'GetEmployee',\n      variables: {\n        id: 'emp123'\n      }\n    },\n    expectedOutput: `query GetEmployee($id: String!) {\n  employee(id: $id) {\n    id\n    name\n    email\n    department {\n      id\n      name\n      description\n    }\n    supervisor {\n      id\n      name\n      email\n      department {\n        id\n        name\n        description\n      }\n      supervisor\n      subordinates\n      roles {\n        id\n        name\n        permissions {\n          id\n          name\n          description\n        }\n      }\n      address {\n        street\n        city\n        state\n        zipCode\n        country\n      }\n      hireDate\n      salary\n    }\n    subordinates {\n      id\n      name\n      email\n      department {\n        id\n        name\n        description\n      }\n      supervisor\n      subordinates\n      roles {\n        id\n        name\n        permissions {\n          id\n          name\n          description\n        }\n      }\n      address {\n        street\n        city\n        state\n        zipCode\n        country\n      }\n      hireDate\n      salary\n    }\n    roles {\n      id\n      name\n      permissions {\n        id\n        name\n        description\n      }\n    }\n    address {\n      street\n      city\n      state\n      zipCode\n      country\n    }\n    hireDate\n    salary\n  }\n}`\n  }\n}",...EmployeeWithCircularReferencesQuery.parameters?.docs?.source}}},ProductWithCircularReferencesQuery.parameters={...ProductWithCircularReferencesQuery.parameters,docs:{...ProductWithCircularReferencesQuery.parameters?.docs,source:{originalSource:"{\n  args: {\n    schema: productSchema,\n    options: {\n      operationName: 'GetProduct',\n      variables: {\n        id: 'prod123'\n      }\n    }\n  }\n}",...ProductWithCircularReferencesQuery.parameters?.docs?.source}}},ComplexOrderQuery.parameters={...ComplexOrderQuery.parameters,docs:{...ComplexOrderQuery.parameters?.docs,source:{originalSource:"{\n  args: {\n    schema: orderSchema,\n    options: {\n      operationName: 'GetOrder',\n      variables: {\n        id: 'order123'\n      }\n    }\n  }\n}",...ComplexOrderQuery.parameters?.docs?.source}}},MediaQuery.parameters={...MediaQuery.parameters,docs:{...MediaQuery.parameters?.docs,source:{originalSource:"{\n  args: {\n    schema: mediaSchema,\n    options: {\n      operationName: 'GetMedia',\n      variables: {\n        id: 'media123'\n      }\n    }\n  }\n}",...MediaQuery.parameters?.docs?.source}}},InferredQueryOperation.parameters={...InferredQueryOperation.parameters,docs:{...InferredQueryOperation.parameters?.docs,source:{originalSource:"{\n  args: {\n    schema: userSchema,\n    options: {\n      variables: {\n        id: '123'\n      }\n    },\n    expectedOutput: `query($id: String!) {\n  user(id: $id) {\n    id\n    name\n    email\n    age\n    isActive\n    address {\n      street\n      city\n      state\n      zipCode\n      country\n    }\n  }\n}`\n  }\n}",...InferredQueryOperation.parameters?.docs?.source}}},MaxDepth1Query.parameters={...MaxDepth1Query.parameters,docs:{...MaxDepth1Query.parameters?.docs,source:{originalSource:"{\n  args: {\n    schema: postSchema,\n    options: {\n      operationName: 'GetPostLimitedDepth',\n      variables: {\n        id: 'post123'\n      },\n      maxDepth: 3 // Limit to just the post fields + 1 level\n    },\n    expectedOutput: `query GetPostLimitedDepth($id: String!) {\n  post(id: $id) {\n    id\n    title\n    content\n    author {\n      id\n      name\n      email\n      age\n      isActive\n      address\n    }\n    comments {\n      id\n      text\n      author\n      createdAt\n      likes\n      replies\n    }\n    tags\n    createdAt\n    updatedAt\n  }\n}`\n  }\n}",...MaxDepth1Query.parameters?.docs?.source}}},VeryShallowQuery.parameters={...VeryShallowQuery.parameters,docs:{...VeryShallowQuery.parameters?.docs,source:{originalSource:"{\n  args: {\n    schema: orderSchema,\n    options: {\n      operationName: 'GetOrderShallow',\n      variables: {\n        id: 'order123'\n      },\n      maxDepth: 2 // Only the direct fields, no nesting\n    },\n    expectedOutput: `query GetOrderShallow($id: String!) {\n  order(id: $id) {\n    id\n    customer\n    items\n    totalAmount\n    status\n    shippingAddress\n    billingAddress\n    createdAt\n    updatedAt\n    relatedOrders\n  }\n}`\n  }\n}",...VeryShallowQuery.parameters?.docs?.source}}}},"./src/query.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{O:()=>processQuery,V:()=>createQuery});var _index__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/index.ts"),console=__webpack_require__("./node_modules/console-browserify/index.js");function processQuery(schema,options={}){const{operationName,variables,maxDepth=10}=options,operation=operationName?` ${operationName}`:"",varsString=(0,_index__WEBPACK_IMPORTED_MODULE_0__.Hh)(variables,options.inputTypeMap),fieldArgs=(0,_index__WEBPACK_IMPORTED_MODULE_0__.ON)(variables),queryField=(0,_index__WEBPACK_IMPORTED_MODULE_0__.Jf)(schema,operationName);return console.log(operation,varsString,fieldArgs,queryField),`${_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Query}${operation}${varsString} {\n  ${queryField}${fieldArgs} {\n${(0,_index__WEBPACK_IMPORTED_MODULE_0__.fO)(schema,_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Query,options,2)}  }\n}`}function createQuery(schema,options={}){return schema.toGQL(_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Query,options)}},"./src/subscription.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{K:()=>createSubscription,d:()=>processSubscription});var _index__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/index.ts");function processSubscription(schema,options={}){const{operationName,variables,maxDepth=10}=options,operation=operationName?` ${operationName}`:"",varsString=(0,_index__WEBPACK_IMPORTED_MODULE_0__.Hh)(variables,options.inputTypeMap),fieldArgs=(0,_index__WEBPACK_IMPORTED_MODULE_0__.ON)(variables),subscriptionField=(0,_index__WEBPACK_IMPORTED_MODULE_0__.Jf)(schema,operationName);return`${_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Subscription}${operation}${varsString} {\n  ${subscriptionField}${fieldArgs} {\n${(0,_index__WEBPACK_IMPORTED_MODULE_0__.fO)(schema,_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Subscription,options,2)}  }\n}`}function createSubscription(schema,options={}){return schema.toGQL(_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Subscription,options)}}}]);