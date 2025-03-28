"use strict";(self.webpackChunkzod2gql=self.webpackChunkzod2gql||[]).push([[453],{"./src/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Hh:()=>formatVariablesDeclaration,Jf:()=>getOperationFieldName,Nt:()=>GQLType,ON:()=>formatFieldArguments,fO:()=>processFields});var zod__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/zod/lib/index.mjs"),_mutation__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/mutation.ts"),_query__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/query.ts"),_subscription__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/subscription.ts"),GQLType=function(GQLType){return GQLType.Query="query",GQLType.Mutation="mutation",GQLType.Subscription="subscription",GQLType}({});const getOperationFieldName=(schema,operationName)=>{if(operationName){let fieldName=operationName;const prefixes=["Get","Create","Update","Delete","Subscribe"];for(const prefix of prefixes)if(fieldName.startsWith(prefix)){fieldName=fieldName.substring(prefix.length);break}return fieldName.charAt(0).toLowerCase()+fieldName.slice(1)}{const typeName=schema._def.typeName||"";return typeName?typeName.charAt(0).toLowerCase()+typeName.slice(1):""}},formatVariablesDeclaration=(variables,inputTypeMap)=>variables&&0!==Object.keys(variables).length?`(${Object.entries(variables).map((([key,value])=>{if(inputTypeMap&&inputTypeMap[key])return`$${key}: ${inputTypeMap[key]}!`;let type="String";return"number"==typeof value&&(type="Int"),"boolean"==typeof value&&(type="Boolean"),"object"==typeof value&&null!==value&&(type=`${key.charAt(0).toUpperCase()+key.slice(1)}Input`),`$${key}: ${type}!`})).join(", ")})`:"",formatFieldArguments=variables=>variables&&0!==Object.keys(variables).length?`(${Object.entries(variables).map((([key])=>`${key}: $${key}`)).join(", ")})`:"",processFields=(schema,queryType,options={},depth=0)=>{const{maxDepth=10}=options;if(depth>maxDepth)return"";const indent="  ".repeat(depth);let query="";const shape=schema._def.shape();for(const[key,value]of Object.entries(shape)){const processSchema=(schema,fieldName)=>{if(schema instanceof zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodObject)query+=`${indent}${fieldName} {\n${processFields(schema,queryType,options,depth+1)}${indent}}\n`;else if(schema instanceof zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodArray){const elementType=schema._def.type;elementType&&"object"==typeof elementType&&"toJSON"in elementType?processSchema(elementType,fieldName):query+=`${indent}${fieldName}\n`}else if(schema instanceof zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodLazy){const innerType=schema._def.getter();innerType&&"object"==typeof innerType&&"toJSON"in innerType?processSchema(innerType,fieldName):query+=`${indent}${fieldName}\n`}else if(schema instanceof zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodOptional||schema instanceof zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodNullable){const innerType=schema._def.innerType;innerType&&"object"==typeof innerType&&"toJSON"in innerType?processSchema(innerType,fieldName):query+=`${indent}${fieldName}\n`}else schema instanceof zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodUnion||zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodEnum,query+=`${indent}${fieldName}\n`};value&&"object"==typeof value&&"toJSON"in value?processSchema(value,key):query+=`${indent}${key}\n`}return query};zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodObject.prototype.toGQL=function(queryType="query",options={},depth=0){if(depth>0)return processFields(this,queryType,options,depth);switch(queryType){case"query":return(0,_query__WEBPACK_IMPORTED_MODULE_1__.O)(this,options);case"mutation":return(0,_mutation__WEBPACK_IMPORTED_MODULE_0__.n)(this,options);case"subscription":return(0,_subscription__WEBPACK_IMPORTED_MODULE_2__.d)(this,options);default:return""}}},"./src/mutation.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{W:()=>createMutation,n:()=>processMutation});var _index__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/index.ts");function processMutation(schema,options={}){const{operationName,variables,maxDepth=10,inputTypeMap}=options,operation=operationName?` ${operationName}`:"",varsString=((variables,inputTypeMap)=>variables&&0!==Object.keys(variables).length?`(${Object.entries(variables).map((([key,value])=>{if(inputTypeMap&&inputTypeMap[key])return`$${key}: ${inputTypeMap[key]}!`;let type="String";return"number"==typeof value?type="Int":"boolean"==typeof value?type="Boolean":"object"==typeof value&&null!==value&&(type=`${key.charAt(0).toUpperCase()+key.slice(1)}Input`),`$${key}: ${type}!`})).join(", ")})`:"")(variables,inputTypeMap),fieldArgs=(0,_index__WEBPACK_IMPORTED_MODULE_0__.ON)(variables),mutationField=(0,_index__WEBPACK_IMPORTED_MODULE_0__.Jf)(schema,operationName);return`${_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Mutation}${operation}${varsString} {\n  ${mutationField}${fieldArgs} {\n${(0,_index__WEBPACK_IMPORTED_MODULE_0__.fO)(schema,_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Mutation,options,2)}  }\n}`}function createMutation(schema,options={}){return schema.toGQL(_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Mutation,options)}},"./src/query.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{ComplexOrderQuery:()=>ComplexOrderQuery,EmployeeWithCircularReferencesQuery:()=>EmployeeWithCircularReferencesQuery,InferredQueryOperation:()=>InferredQueryOperation,MaxDepth1Query:()=>MaxDepth1Query,MediaQuery:()=>MediaQuery,NestedCommentsQuery:()=>NestedCommentsQuery,PostWithCommentsQuery:()=>PostWithCommentsQuery,ProductWithCircularReferencesQuery:()=>ProductWithCircularReferencesQuery,SimpleQuery:()=>SimpleQuery,VeryShallowQuery:()=>VeryShallowQuery,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/next/dist/compiled/react/jsx-runtime.js"),_storybook_test__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@storybook/test/dist/index.mjs"),zod__WEBPACK_IMPORTED_MODULE_5__=(__webpack_require__("./node_modules/next/dist/compiled/react/index.js"),__webpack_require__("./node_modules/zod/lib/index.mjs")),_query__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/query.ts");__webpack_require__("./src/index.ts");const withTypeName=(schema,name)=>(schema._def.typeName=name,schema),__WEBPACK_DEFAULT_EXPORT__={title:"GraphQL/Query",component:({schema,options,expectedOutput})=>{const query=(0,_query__WEBPACK_IMPORTED_MODULE_3__.V)(schema,options);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3",{children:"Generated GraphQL Query"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("pre",{"data-testid":"query-output",children:query}),expectedOutput&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3",{children:"Expected Output"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("pre",{"data-testid":"expected-output",children:expectedOutput})]})]})},parameters:{docs:{description:{component:"Generate GraphQL queries from Zod schemas. See the [Queries documentation](/?path=/docs/documentation-queries--docs) for more details."},source:{type:"dynamic",excludeDecorators:!0}}}},addressSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({street:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),city:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),state:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),zipCode:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),country:zod__WEBPACK_IMPORTED_MODULE_5__.z.string().optional()}),"Address"),userSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({id:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),name:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),email:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),age:zod__WEBPACK_IMPORTED_MODULE_5__.z.number(),isActive:zod__WEBPACK_IMPORTED_MODULE_5__.z.boolean(),address:addressSchema.optional()}),"User"),commentSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({id:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),text:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),author:userSchema,createdAt:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),likes:zod__WEBPACK_IMPORTED_MODULE_5__.z.number(),replies:zod__WEBPACK_IMPORTED_MODULE_5__.z.array(zod__WEBPACK_IMPORTED_MODULE_5__.z.lazy((()=>commentSchema))).optional()}),"Comment"),postSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({id:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),title:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),content:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),author:userSchema,comments:zod__WEBPACK_IMPORTED_MODULE_5__.z.array(commentSchema),tags:zod__WEBPACK_IMPORTED_MODULE_5__.z.array(zod__WEBPACK_IMPORTED_MODULE_5__.z.string()),createdAt:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),updatedAt:zod__WEBPACK_IMPORTED_MODULE_5__.z.string().optional()}),"Post"),permissionSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({id:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),name:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),description:zod__WEBPACK_IMPORTED_MODULE_5__.z.string().optional()}),"Permission"),roleSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({id:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),name:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),permissions:zod__WEBPACK_IMPORTED_MODULE_5__.z.array(permissionSchema)}),"Role"),departmentSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({id:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),name:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),description:zod__WEBPACK_IMPORTED_MODULE_5__.z.string().optional()}),"Department"),employeeSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({id:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),name:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),email:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),department:departmentSchema,supervisor:zod__WEBPACK_IMPORTED_MODULE_5__.z.lazy((()=>employeeSchema)).optional(),subordinates:zod__WEBPACK_IMPORTED_MODULE_5__.z.array(zod__WEBPACK_IMPORTED_MODULE_5__.z.lazy((()=>employeeSchema))).optional(),roles:zod__WEBPACK_IMPORTED_MODULE_5__.z.array(roleSchema),address:addressSchema,hireDate:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),salary:zod__WEBPACK_IMPORTED_MODULE_5__.z.number()}),"Employee"),categorySchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({id:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),name:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),description:zod__WEBPACK_IMPORTED_MODULE_5__.z.string().optional(),parentCategory:zod__WEBPACK_IMPORTED_MODULE_5__.z.lazy((()=>categorySchema)).optional(),subcategories:zod__WEBPACK_IMPORTED_MODULE_5__.z.array(zod__WEBPACK_IMPORTED_MODULE_5__.z.lazy((()=>categorySchema))).optional()}),"Category"),productSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({id:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),name:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),description:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),price:zod__WEBPACK_IMPORTED_MODULE_5__.z.number(),category:categorySchema,relatedProducts:zod__WEBPACK_IMPORTED_MODULE_5__.z.array(zod__WEBPACK_IMPORTED_MODULE_5__.z.lazy((()=>productSchema))).optional(),attributes:zod__WEBPACK_IMPORTED_MODULE_5__.z.record(zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),zod__WEBPACK_IMPORTED_MODULE_5__.z.union([zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),zod__WEBPACK_IMPORTED_MODULE_5__.z.number(),zod__WEBPACK_IMPORTED_MODULE_5__.z.boolean()])),stockQuantity:zod__WEBPACK_IMPORTED_MODULE_5__.z.number(),isAvailable:zod__WEBPACK_IMPORTED_MODULE_5__.z.boolean()}),"Product"),orderItemSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({id:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),product:productSchema,quantity:zod__WEBPACK_IMPORTED_MODULE_5__.z.number(),unitPrice:zod__WEBPACK_IMPORTED_MODULE_5__.z.number(),totalPrice:zod__WEBPACK_IMPORTED_MODULE_5__.z.number()}),"OrderItem"),orderSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({id:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),customer:userSchema,items:zod__WEBPACK_IMPORTED_MODULE_5__.z.array(orderItemSchema),totalAmount:zod__WEBPACK_IMPORTED_MODULE_5__.z.number(),status:zod__WEBPACK_IMPORTED_MODULE_5__.z.enum(["pending","processing","shipped","delivered","cancelled"]),shippingAddress:addressSchema,billingAddress:addressSchema,createdAt:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),updatedAt:zod__WEBPACK_IMPORTED_MODULE_5__.z.string().optional(),relatedOrders:zod__WEBPACK_IMPORTED_MODULE_5__.z.array(zod__WEBPACK_IMPORTED_MODULE_5__.z.lazy((()=>orderSchema))).optional()}),"Order"),mediaTypeEnum=zod__WEBPACK_IMPORTED_MODULE_5__.z.enum(["image","video","document"]),imageSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({url:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),width:zod__WEBPACK_IMPORTED_MODULE_5__.z.number(),height:zod__WEBPACK_IMPORTED_MODULE_5__.z.number(),format:zod__WEBPACK_IMPORTED_MODULE_5__.z.string()}),"Image"),videoSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({url:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),duration:zod__WEBPACK_IMPORTED_MODULE_5__.z.number(),format:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),thumbnail:imageSchema.optional()}),"Video"),documentSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({url:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),title:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),fileSize:zod__WEBPACK_IMPORTED_MODULE_5__.z.number(),fileType:zod__WEBPACK_IMPORTED_MODULE_5__.z.string()}),"Document"),mediaSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({id:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),type:mediaTypeEnum,title:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),description:zod__WEBPACK_IMPORTED_MODULE_5__.z.string().optional(),image:imageSchema.optional(),video:videoSchema.optional(),document:documentSchema.optional(),uploadedBy:userSchema,uploadedAt:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),tags:zod__WEBPACK_IMPORTED_MODULE_5__.z.array(zod__WEBPACK_IMPORTED_MODULE_5__.z.string()).optional()}),"Media"),SimpleQuery={args:{schema:userSchema,options:{operationName:"GetUser",variables:{id:"123"}},expectedOutput:"query GetUser($id: String!) {\n  user(id: $id) {\n    id\n    name\n    email\n    age\n    isActive\n    address {\n      street\n      city\n      state\n      zipCode\n      country\n    }\n  }\n}"},parameters:{docs:{description:{story:"A simple GraphQL query with explicit operation name and variables."},source:{type:"code"}}},play:async({canvasElement})=>{const canvas=(0,_storybook_test__WEBPACK_IMPORTED_MODULE_1__.ux)(canvasElement),queryOutput=canvas.getByTestId("query-output"),expectedOutput=canvas.getByTestId("expected-output"),normalizeString=str=>str.replace(/\s+/g,"");(0,_storybook_test__WEBPACK_IMPORTED_MODULE_1__.E3)(normalizeString(queryOutput.textContent||"")).toBe(normalizeString(expectedOutput.textContent||""))}},NestedCommentsQuery={args:{schema:commentSchema,options:{operationName:"GetComment",variables:{id:"comment123"}},expectedOutput:"query GetComment($id: String!) {\n  comment(id: $id) {\n    id\n    text\n    author {\n      id\n      name\n      email\n      age\n      isActive\n      address {\n        street\n        city\n        state\n        zipCode\n        country\n      }\n    }\n    createdAt\n    likes\n    replies {\n      id\n      text\n      author {\n        id\n        name\n        email\n        age\n        isActive\n        address {\n          street\n          city\n          state\n          zipCode\n          country\n        }\n      }\n      createdAt\n      likes\n      replies\n    }\n  }\n}"},parameters:{docs:{description:{story:"A nested GraphQL query for comments with multiple levels of nested data structures including circular references."},source:{type:"code"}}}},PostWithCommentsQuery={args:{schema:postSchema,options:{operationName:"GetPost",variables:{id:"post123"}},expectedOutput:"query GetPost($id: String!) {\n  post(id: $id) {\n    id\n    title\n    content\n    author {\n      id\n      name\n      email\n      age\n      isActive\n      address {\n        street\n        city\n        state\n        zipCode\n        country\n      }\n    }\n    comments {\n      id\n      text\n      author {\n        id\n        name\n        email\n        age\n        isActive\n        address {\n          street\n          city\n          state\n          zipCode\n          country\n        }\n      }\n      createdAt\n      likes\n      replies {\n        id\n        text\n        author {\n          id\n          name\n          email\n          age\n          isActive\n          address {\n            street\n            city\n            state\n            zipCode\n            country\n          }\n        }\n        createdAt\n        likes\n        replies\n      }\n    }\n    tags\n    createdAt\n    updatedAt\n  }\n}"}},EmployeeWithCircularReferencesQuery={args:{schema:employeeSchema,options:{operationName:"GetEmployee",variables:{id:"emp123"}},expectedOutput:"query GetEmployee($id: String!) {\n  employee(id: $id) {\n    id\n    name\n    email\n    department {\n      id\n      name\n      description\n    }\n    supervisor {\n      id\n      name\n      email\n      department {\n        id\n        name\n        description\n      }\n      supervisor\n      subordinates\n      roles {\n        id\n        name\n        permissions {\n          id\n          name\n          description\n        }\n      }\n      address {\n        street\n        city\n        state\n        zipCode\n        country\n      }\n      hireDate\n      salary\n    }\n    subordinates {\n      id\n      name\n      email\n      department {\n        id\n        name\n        description\n      }\n      supervisor\n      subordinates\n      roles {\n        id\n        name\n        permissions {\n          id\n          name\n          description\n        }\n      }\n      address {\n        street\n        city\n        state\n        zipCode\n        country\n      }\n      hireDate\n      salary\n    }\n    roles {\n      id\n      name\n      permissions {\n        id\n        name\n        description\n      }\n    }\n    address {\n      street\n      city\n      state\n      zipCode\n      country\n    }\n    hireDate\n    salary\n  }\n}"}},ProductWithCircularReferencesQuery={args:{schema:productSchema,options:{operationName:"GetProduct",variables:{id:"prod123"}}}},ComplexOrderQuery={args:{schema:orderSchema,options:{operationName:"GetOrder",variables:{id:"order123"}}}},MediaQuery={args:{schema:mediaSchema,options:{operationName:"GetMedia",variables:{id:"media123"}}}},InferredQueryOperation={args:{schema:userSchema,options:{variables:{id:"123"}},expectedOutput:"query($id: String!) {\n  user(id: $id) {\n    id\n    name\n    email\n    age\n    isActive\n    address {\n      street\n      city\n      state\n      zipCode\n      country\n    }\n  }\n}"}},MaxDepth1Query={args:{schema:postSchema,options:{operationName:"GetPostLimitedDepth",variables:{id:"post123"},maxDepth:3},expectedOutput:"query GetPostLimitedDepth($id: String!) {\n  post(id: $id) {\n    id\n    title\n    content\n    author {\n      id\n      name\n      email\n      age\n      isActive\n      address\n    }\n    comments {\n      id\n      text\n      author\n      createdAt\n      likes\n      replies\n    }\n    tags\n    createdAt\n    updatedAt\n  }\n}"}},VeryShallowQuery={args:{schema:orderSchema,options:{operationName:"GetOrderShallow",variables:{id:"order123"},maxDepth:2},expectedOutput:"query GetOrderShallow($id: String!) {\n  order(id: $id) {\n    id\n    customer\n    items\n    totalAmount\n    status\n    shippingAddress\n    billingAddress\n    createdAt\n    updatedAt\n    relatedOrders\n  }\n}"}},__namedExportsOrder=["SimpleQuery","NestedCommentsQuery","PostWithCommentsQuery","EmployeeWithCircularReferencesQuery","ProductWithCircularReferencesQuery","ComplexOrderQuery","MediaQuery","InferredQueryOperation","MaxDepth1Query","VeryShallowQuery"];SimpleQuery.parameters={...SimpleQuery.parameters,docs:{...SimpleQuery.parameters?.docs,source:{originalSource:"{\n  args: {\n    schema: userSchema,\n    options: {\n      operationName: 'GetUser',\n      variables: {\n        id: '123'\n      }\n    },\n    expectedOutput: `query GetUser($id: String!) {\n  user(id: $id) {\n    id\n    name\n    email\n    age\n    isActive\n    address {\n      street\n      city\n      state\n      zipCode\n      country\n    }\n  }\n}`\n  },\n  parameters: {\n    docs: {\n      description: {\n        story: 'A simple GraphQL query with explicit operation name and variables.'\n      },\n      source: {\n        type: 'code'\n      }\n    }\n  },\n  play: async ({\n    canvasElement\n  }) => {\n    const canvas = within(canvasElement);\n\n    // Get the generated output\n    const queryOutput = canvas.getByTestId('query-output');\n    const expectedOutput = canvas.getByTestId('expected-output');\n\n    // Normalize strings (remove whitespace) for comparison\n    const normalizeString = (str: string) => str.replace(/\\s+/g, '');\n    expect(normalizeString(queryOutput.textContent || '')).toBe(normalizeString(expectedOutput.textContent || ''));\n  }\n}",...SimpleQuery.parameters?.docs?.source}}},NestedCommentsQuery.parameters={...NestedCommentsQuery.parameters,docs:{...NestedCommentsQuery.parameters?.docs,source:{originalSource:"{\n  args: {\n    schema: commentSchema,\n    options: {\n      operationName: 'GetComment',\n      variables: {\n        id: 'comment123'\n      }\n    },\n    expectedOutput: `query GetComment($id: String!) {\n  comment(id: $id) {\n    id\n    text\n    author {\n      id\n      name\n      email\n      age\n      isActive\n      address {\n        street\n        city\n        state\n        zipCode\n        country\n      }\n    }\n    createdAt\n    likes\n    replies {\n      id\n      text\n      author {\n        id\n        name\n        email\n        age\n        isActive\n        address {\n          street\n          city\n          state\n          zipCode\n          country\n        }\n      }\n      createdAt\n      likes\n      replies\n    }\n  }\n}`\n  },\n  parameters: {\n    docs: {\n      description: {\n        story: 'A nested GraphQL query for comments with multiple levels of nested data structures including circular references.'\n      },\n      source: {\n        type: 'code'\n      }\n    }\n  }\n}",...NestedCommentsQuery.parameters?.docs?.source}}},PostWithCommentsQuery.parameters={...PostWithCommentsQuery.parameters,docs:{...PostWithCommentsQuery.parameters?.docs,source:{originalSource:"{\n  args: {\n    schema: postSchema,\n    options: {\n      operationName: 'GetPost',\n      variables: {\n        id: 'post123'\n      }\n    },\n    expectedOutput: `query GetPost($id: String!) {\n  post(id: $id) {\n    id\n    title\n    content\n    author {\n      id\n      name\n      email\n      age\n      isActive\n      address {\n        street\n        city\n        state\n        zipCode\n        country\n      }\n    }\n    comments {\n      id\n      text\n      author {\n        id\n        name\n        email\n        age\n        isActive\n        address {\n          street\n          city\n          state\n          zipCode\n          country\n        }\n      }\n      createdAt\n      likes\n      replies {\n        id\n        text\n        author {\n          id\n          name\n          email\n          age\n          isActive\n          address {\n            street\n            city\n            state\n            zipCode\n            country\n          }\n        }\n        createdAt\n        likes\n        replies\n      }\n    }\n    tags\n    createdAt\n    updatedAt\n  }\n}`\n  }\n}",...PostWithCommentsQuery.parameters?.docs?.source}}},EmployeeWithCircularReferencesQuery.parameters={...EmployeeWithCircularReferencesQuery.parameters,docs:{...EmployeeWithCircularReferencesQuery.parameters?.docs,source:{originalSource:"{\n  args: {\n    schema: employeeSchema,\n    options: {\n      operationName: 'GetEmployee',\n      variables: {\n        id: 'emp123'\n      }\n    },\n    expectedOutput: `query GetEmployee($id: String!) {\n  employee(id: $id) {\n    id\n    name\n    email\n    department {\n      id\n      name\n      description\n    }\n    supervisor {\n      id\n      name\n      email\n      department {\n        id\n        name\n        description\n      }\n      supervisor\n      subordinates\n      roles {\n        id\n        name\n        permissions {\n          id\n          name\n          description\n        }\n      }\n      address {\n        street\n        city\n        state\n        zipCode\n        country\n      }\n      hireDate\n      salary\n    }\n    subordinates {\n      id\n      name\n      email\n      department {\n        id\n        name\n        description\n      }\n      supervisor\n      subordinates\n      roles {\n        id\n        name\n        permissions {\n          id\n          name\n          description\n        }\n      }\n      address {\n        street\n        city\n        state\n        zipCode\n        country\n      }\n      hireDate\n      salary\n    }\n    roles {\n      id\n      name\n      permissions {\n        id\n        name\n        description\n      }\n    }\n    address {\n      street\n      city\n      state\n      zipCode\n      country\n    }\n    hireDate\n    salary\n  }\n}`\n  }\n}",...EmployeeWithCircularReferencesQuery.parameters?.docs?.source}}},ProductWithCircularReferencesQuery.parameters={...ProductWithCircularReferencesQuery.parameters,docs:{...ProductWithCircularReferencesQuery.parameters?.docs,source:{originalSource:"{\n  args: {\n    schema: productSchema,\n    options: {\n      operationName: 'GetProduct',\n      variables: {\n        id: 'prod123'\n      }\n    }\n  }\n}",...ProductWithCircularReferencesQuery.parameters?.docs?.source}}},ComplexOrderQuery.parameters={...ComplexOrderQuery.parameters,docs:{...ComplexOrderQuery.parameters?.docs,source:{originalSource:"{\n  args: {\n    schema: orderSchema,\n    options: {\n      operationName: 'GetOrder',\n      variables: {\n        id: 'order123'\n      }\n    }\n  }\n}",...ComplexOrderQuery.parameters?.docs?.source}}},MediaQuery.parameters={...MediaQuery.parameters,docs:{...MediaQuery.parameters?.docs,source:{originalSource:"{\n  args: {\n    schema: mediaSchema,\n    options: {\n      operationName: 'GetMedia',\n      variables: {\n        id: 'media123'\n      }\n    }\n  }\n}",...MediaQuery.parameters?.docs?.source}}},InferredQueryOperation.parameters={...InferredQueryOperation.parameters,docs:{...InferredQueryOperation.parameters?.docs,source:{originalSource:"{\n  args: {\n    schema: userSchema,\n    options: {\n      variables: {\n        id: '123'\n      }\n    },\n    expectedOutput: `query($id: String!) {\n  user(id: $id) {\n    id\n    name\n    email\n    age\n    isActive\n    address {\n      street\n      city\n      state\n      zipCode\n      country\n    }\n  }\n}`\n  }\n}",...InferredQueryOperation.parameters?.docs?.source}}},MaxDepth1Query.parameters={...MaxDepth1Query.parameters,docs:{...MaxDepth1Query.parameters?.docs,source:{originalSource:"{\n  args: {\n    schema: postSchema,\n    options: {\n      operationName: 'GetPostLimitedDepth',\n      variables: {\n        id: 'post123'\n      },\n      maxDepth: 3 // Limit to just the post fields + 1 level\n    },\n    expectedOutput: `query GetPostLimitedDepth($id: String!) {\n  post(id: $id) {\n    id\n    title\n    content\n    author {\n      id\n      name\n      email\n      age\n      isActive\n      address\n    }\n    comments {\n      id\n      text\n      author\n      createdAt\n      likes\n      replies\n    }\n    tags\n    createdAt\n    updatedAt\n  }\n}`\n  }\n}",...MaxDepth1Query.parameters?.docs?.source}}},VeryShallowQuery.parameters={...VeryShallowQuery.parameters,docs:{...VeryShallowQuery.parameters?.docs,source:{originalSource:"{\n  args: {\n    schema: orderSchema,\n    options: {\n      operationName: 'GetOrderShallow',\n      variables: {\n        id: 'order123'\n      },\n      maxDepth: 2 // Only the direct fields, no nesting\n    },\n    expectedOutput: `query GetOrderShallow($id: String!) {\n  order(id: $id) {\n    id\n    customer\n    items\n    totalAmount\n    status\n    shippingAddress\n    billingAddress\n    createdAt\n    updatedAt\n    relatedOrders\n  }\n}`\n  }\n}",...VeryShallowQuery.parameters?.docs?.source}}}},"./src/query.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{O:()=>processQuery,V:()=>createQuery});var _index__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/index.ts");function processQuery(schema,options={}){const{operationName,variables,maxDepth=10}=options,operation=operationName?` ${operationName}`:"",varsString=(0,_index__WEBPACK_IMPORTED_MODULE_0__.Hh)(variables,options.inputTypeMap),fieldArgs=(0,_index__WEBPACK_IMPORTED_MODULE_0__.ON)(variables),queryField=(0,_index__WEBPACK_IMPORTED_MODULE_0__.Jf)(schema,operationName);return`${_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Query}${operation}${varsString} {\n  ${queryField}${fieldArgs} {\n${(0,_index__WEBPACK_IMPORTED_MODULE_0__.fO)(schema,_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Query,options,2)}  }\n}`}function createQuery(schema,options={}){return schema.toGQL(_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Query,options)}},"./src/subscription.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{K:()=>createSubscription,d:()=>processSubscription});var _index__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/index.ts");function processSubscription(schema,options={}){const{operationName,variables,maxDepth=10}=options,operation=operationName?` ${operationName}`:"",varsString=(0,_index__WEBPACK_IMPORTED_MODULE_0__.Hh)(variables,options.inputTypeMap),fieldArgs=(0,_index__WEBPACK_IMPORTED_MODULE_0__.ON)(variables),subscriptionField=(0,_index__WEBPACK_IMPORTED_MODULE_0__.Jf)(schema,operationName);return`${_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Subscription}${operation}${varsString} {\n  ${subscriptionField}${fieldArgs} {\n${(0,_index__WEBPACK_IMPORTED_MODULE_0__.fO)(schema,_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Subscription,options,2)}  }\n}`}function createSubscription(schema,options={}){return schema.toGQL(_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Subscription,options)}}}]);