"use strict";(self.webpackChunkzod2gql=self.webpackChunkzod2gql||[]).push([[590],{"./src/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Hh:()=>formatVariablesDeclaration,Jf:()=>getOperationFieldName,Nt:()=>GQLType,ON:()=>formatFieldArguments,fO:()=>processFields});var zod__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/zod/lib/index.mjs"),_mutation__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/mutation.ts"),_query__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/query.ts"),_subscription__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/subscription.ts"),GQLType=function(GQLType){return GQLType.Query="query",GQLType.Mutation="mutation",GQLType.Subscription="subscription",GQLType}({});const getOperationFieldName=(schema,operationName)=>{if(operationName){let fieldName=operationName;const prefixes=["Get","Create","Update","Delete","Subscribe"];for(const prefix of prefixes)if(fieldName.startsWith(prefix)){fieldName=fieldName.substring(prefix.length);break}return fieldName.charAt(0).toLowerCase()+fieldName.slice(1)}{const typeName=schema._def.typeName||"";return typeName?typeName.charAt(0).toLowerCase()+typeName.slice(1):""}},formatVariablesDeclaration=(variables,inputTypeMap)=>variables&&0!==Object.keys(variables).length?`(${Object.entries(variables).map((([key,value])=>{if(inputTypeMap&&inputTypeMap[key])return`$${key}: ${inputTypeMap[key]}!`;let type="String";return"number"==typeof value&&(type="Int"),"boolean"==typeof value&&(type="Boolean"),"object"==typeof value&&null!==value&&(type=`${key.charAt(0).toUpperCase()+key.slice(1)}Input`),`$${key}: ${type}!`})).join(", ")})`:"",formatFieldArguments=variables=>variables&&0!==Object.keys(variables).length?`(${Object.entries(variables).map((([key])=>`${key}: $${key}`)).join(", ")})`:"",processFields=(schema,queryType,options={},depth=0)=>{const{maxDepth=10}=options;if(depth>maxDepth)return"";const indent="  ".repeat(depth);let query="";const shape=schema._def.shape();for(const[key,value]of Object.entries(shape)){const processSchema=(schema,fieldName)=>{if(schema instanceof zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodObject)query+=`${indent}${fieldName} {\n${processFields(schema,queryType,options,depth+1)}${indent}}\n`;else if(schema instanceof zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodArray){const elementType=schema._def.type;elementType&&"object"==typeof elementType&&"toJSON"in elementType?processSchema(elementType,fieldName):query+=`${indent}${fieldName}\n`}else if(schema instanceof zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodLazy){const innerType=schema._def.getter();innerType&&"object"==typeof innerType&&"toJSON"in innerType?processSchema(innerType,fieldName):query+=`${indent}${fieldName}\n`}else if(schema instanceof zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodOptional||schema instanceof zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodNullable){const innerType=schema._def.innerType;innerType&&"object"==typeof innerType&&"toJSON"in innerType?processSchema(innerType,fieldName):query+=`${indent}${fieldName}\n`}else schema instanceof zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodUnion||zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodEnum,query+=`${indent}${fieldName}\n`};value&&"object"==typeof value&&"toJSON"in value?processSchema(value,key):query+=`${indent}${key}\n`}return query};zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodObject.prototype.toGQL=function(queryType="query",options={},depth=0){if(depth>0)return processFields(this,queryType,options,depth);switch(queryType){case"query":return(0,_query__WEBPACK_IMPORTED_MODULE_1__.O)(this,options);case"mutation":return(0,_mutation__WEBPACK_IMPORTED_MODULE_0__.n)(this,options);case"subscription":return(0,_subscription__WEBPACK_IMPORTED_MODULE_2__.d)(this,options);default:return""}}},"./src/mutation.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{CreateCommentMutation:()=>CreateCommentMutation,CreateOrderWithNestedInput:()=>CreateOrderWithNestedInput,CreatePostMutation:()=>CreatePostMutation,CreateProductWithInputTypes:()=>CreateProductWithInputTypes,CreateUserMutation:()=>CreateUserMutation,InferredMutationName:()=>InferredMutationName,LimitedDepthMutation:()=>LimitedDepthMutation,UpdatePostMutation:()=>UpdatePostMutation,UpdateProductWithMultipleInputs:()=>UpdateProductWithMultipleInputs,UpdateUserMutation:()=>UpdateUserMutation,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/next/dist/compiled/react/jsx-runtime.js"),_storybook_test__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@storybook/test/dist/index.mjs"),zod__WEBPACK_IMPORTED_MODULE_5__=(__webpack_require__("./node_modules/next/dist/compiled/react/index.js"),__webpack_require__("./node_modules/zod/lib/index.mjs")),_mutation__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/mutation.ts");__webpack_require__("./src/index.ts");const withTypeName=(schema,name)=>(schema._def.typeName=name,schema),__WEBPACK_DEFAULT_EXPORT__={title:"GraphQL/Mutation",component:({schema,options,expectedOutput})=>{const mutation=(0,_mutation__WEBPACK_IMPORTED_MODULE_3__.W)(schema,options);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3",{children:"Generated GraphQL Mutation"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("pre",{"data-testid":"mutation-output",children:mutation}),expectedOutput&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3",{children:"Expected Output"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("pre",{"data-testid":"expected-output",children:expectedOutput})]})]})},parameters:{docs:{description:{component:"Generate GraphQL mutations from Zod schemas. See the [Mutations documentation](/?path=/docs/documentation-mutations--docs) for more details."},source:{type:"dynamic",excludeDecorators:!0}}}},addressSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({street:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),city:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),state:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),zipCode:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),country:zod__WEBPACK_IMPORTED_MODULE_5__.z.string().optional()}),"Address"),createUserResponseSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({id:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),name:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),email:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),createdAt:zod__WEBPACK_IMPORTED_MODULE_5__.z.string()}),"CreateUserResponse"),updateUserResponseSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({id:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),name:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),email:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),age:zod__WEBPACK_IMPORTED_MODULE_5__.z.number().optional(),isActive:zod__WEBPACK_IMPORTED_MODULE_5__.z.boolean().optional(),updatedAt:zod__WEBPACK_IMPORTED_MODULE_5__.z.string()}),"UpdateUserResponse"),userSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({id:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),name:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),email:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),age:zod__WEBPACK_IMPORTED_MODULE_5__.z.number().optional(),isActive:zod__WEBPACK_IMPORTED_MODULE_5__.z.boolean().optional(),address:addressSchema.optional()}),"User"),createPostResponseSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({id:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),title:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),content:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),authorId:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),published:zod__WEBPACK_IMPORTED_MODULE_5__.z.boolean(),createdAt:zod__WEBPACK_IMPORTED_MODULE_5__.z.string()}),"CreatePostResponse"),updatePostResponseSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({id:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),title:zod__WEBPACK_IMPORTED_MODULE_5__.z.string().optional(),content:zod__WEBPACK_IMPORTED_MODULE_5__.z.string().optional(),published:zod__WEBPACK_IMPORTED_MODULE_5__.z.boolean().optional(),updatedAt:zod__WEBPACK_IMPORTED_MODULE_5__.z.string()}),"UpdatePostResponse"),createCommentResponseSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({id:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),text:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),authorId:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),postId:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),createdAt:zod__WEBPACK_IMPORTED_MODULE_5__.z.string()}),"CreateCommentResponse"),productSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({id:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),name:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),description:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),price:zod__WEBPACK_IMPORTED_MODULE_5__.z.number(),categories:zod__WEBPACK_IMPORTED_MODULE_5__.z.array(zod__WEBPACK_IMPORTED_MODULE_5__.z.string()),attributes:zod__WEBPACK_IMPORTED_MODULE_5__.z.record(zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),zod__WEBPACK_IMPORTED_MODULE_5__.z.union([zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),zod__WEBPACK_IMPORTED_MODULE_5__.z.number(),zod__WEBPACK_IMPORTED_MODULE_5__.z.boolean()])),stockQuantity:zod__WEBPACK_IMPORTED_MODULE_5__.z.number(),isAvailable:zod__WEBPACK_IMPORTED_MODULE_5__.z.boolean(),createdAt:zod__WEBPACK_IMPORTED_MODULE_5__.z.string()}),"Product"),orderItemSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({productId:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),quantity:zod__WEBPACK_IMPORTED_MODULE_5__.z.number(),unitPrice:zod__WEBPACK_IMPORTED_MODULE_5__.z.number()}),"OrderItem"),createOrderResponseSchema=withTypeName(zod__WEBPACK_IMPORTED_MODULE_5__.z.object({id:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),customerId:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),items:zod__WEBPACK_IMPORTED_MODULE_5__.z.array(orderItemSchema),totalAmount:zod__WEBPACK_IMPORTED_MODULE_5__.z.number(),status:zod__WEBPACK_IMPORTED_MODULE_5__.z.enum(["pending","processing","shipped","delivered","cancelled"]),shippingAddressId:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),billingAddressId:zod__WEBPACK_IMPORTED_MODULE_5__.z.string(),createdAt:zod__WEBPACK_IMPORTED_MODULE_5__.z.string()}),"CreateOrderResponse"),CreateUserMutation={args:{schema:createUserResponseSchema,options:{operationName:"CreateUser",variables:{name:"John Doe",email:"john@example.com",password:"secret123"}},expectedOutput:"mutation CreateUser($name: String!, $email: String!, $password: String!) {\n  createUser(name: $name, email: $email, password: $password) {\n    id\n    name\n    email\n    createdAt\n  }\n}"},play:async({canvasElement})=>{const canvas=(0,_storybook_test__WEBPACK_IMPORTED_MODULE_1__.ux)(canvasElement),mutationOutput=canvas.getByTestId("mutation-output"),expectedOutput=canvas.getByTestId("expected-output"),normalizeString=str=>str.replace(/\s+/g,"");(0,_storybook_test__WEBPACK_IMPORTED_MODULE_1__.E3)(normalizeString(mutationOutput.textContent||"")).toBe(normalizeString(expectedOutput.textContent||""))}},UpdateUserMutation={args:{schema:updateUserResponseSchema,options:{operationName:"UpdateUser",variables:{id:"user123",name:"John Updated",email:"john.updated@example.com",isActive:!0}},expectedOutput:"mutation UpdateUser($id: String!, $name: String!, $email: String!, $isActive: Boolean!) {\n  updateUser(id: $id, name: $name, email: $email, isActive: $isActive) {\n    id\n    name\n    email\n    age\n    isActive\n    updatedAt\n  }\n}"}},CreatePostMutation={args:{schema:createPostResponseSchema,options:{operationName:"CreatePost",variables:{title:"My First Post",content:"This is the content of my first post",authorId:"user123",published:!0}},expectedOutput:"mutation CreatePost($title: String!, $content: String!, $authorId: String!, $published: Boolean!) {\n  createPost(title: $title, content: $content, authorId: $authorId, published: $published) {\n    id\n    title\n    content\n    authorId\n    published\n    createdAt\n  }\n}"}},UpdatePostMutation={args:{schema:updatePostResponseSchema,options:{operationName:"UpdatePost",variables:{id:"post123",title:"Updated Post Title",published:!0}},expectedOutput:"mutation UpdatePost($id: String!, $title: String!, $published: Boolean!) {\n  updatePost(id: $id, title: $title, published: $published) {\n    id\n    title\n    content\n    published\n    updatedAt\n  }\n}"}},CreateCommentMutation={args:{schema:createCommentResponseSchema,options:{operationName:"CreateComment",variables:{text:"This is my comment",postId:"post123",authorId:"user123"}},expectedOutput:"mutation CreateComment($text: String!, $postId: String!, $authorId: String!) {\n  createComment(text: $text, postId: $postId, authorId: $authorId) {\n    id\n    text\n    authorId\n    postId\n    createdAt\n  }\n}"}},CreateProductWithInputTypes={args:{schema:productSchema,options:{operationName:"CreateProduct",variables:{productInput:{name:"New Product",description:"Product description",price:99.99,categories:["electronics","gadgets"],attributes:{color:"black",weight:150}}},inputTypeMap:{productInput:"ProductInput"}},expectedOutput:"mutation CreateProduct($productInput: ProductInput!) {\n  createProduct(productInput: $productInput) {\n    id\n    name\n    description\n    price\n    categories\n    attributes\n    stockQuantity\n    isAvailable\n    createdAt\n  }\n}"}},CreateOrderWithNestedInput={args:{schema:createOrderResponseSchema,options:{operationName:"CreateOrder",variables:{order:{customerId:"cust123",items:[{productId:"prod1",quantity:2,unitPrice:10.99},{productId:"prod2",quantity:1,unitPrice:24.99}],shippingAddress:{street:"123 Main St",city:"Anytown",state:"ST",zipCode:"12345"},billingAddress:{street:"123 Main St",city:"Anytown",state:"ST",zipCode:"12345"}}},inputTypeMap:{order:"OrderInput"}},expectedOutput:"mutation CreateOrder($order: OrderInput!) {\n  createOrder(order: $order) {\n    id\n    customerId\n    items {\n      productId\n      quantity\n      unitPrice\n    }\n    totalAmount\n    status\n    shippingAddressId\n    billingAddressId\n    createdAt\n  }\n}"}},UpdateProductWithMultipleInputs={args:{schema:productSchema,options:{operationName:"UpdateProduct",variables:{id:"prod123",productData:{name:"Updated Product",price:129.99},stockData:{quantity:50,isAvailable:!0}}},expectedOutput:"mutation UpdateProduct($id: String!, $productData: ProductDataInput!, $stockData: StockDataInput!) {\n  updateProduct(id: $id, productData: $productData, stockData: $stockData) {\n    id\n    name\n    description\n    price\n    categories\n    attributes\n    stockQuantity\n    isAvailable\n    createdAt\n  }\n}"}},InferredMutationName={args:{schema:userSchema,options:{variables:{name:"John Doe",email:"john@example.com"}},expectedOutput:"mutation($name: String!, $email: String!) {\n  user(name: $name, email: $email) {\n    id\n    name\n    email\n    age\n    isActive\n    address {\n      street\n      city\n      state\n      zipCode\n      country\n    }\n  }\n}"}},LimitedDepthMutation={args:{schema:userSchema,options:{operationName:"CreateUser",variables:{userData:{name:"John Doe",email:"john@example.com",address:{street:"123 Main St",city:"Anytown",state:"ST",zipCode:"12345"}}},maxDepth:3},expectedOutput:"mutation CreateUser($userData: UserDataInput!) {\n  createUser(userData: $userData) {\n    id\n    name\n    email\n    age\n    isActive\n    address {\n      street\n      city\n      state\n      zipCode\n      country\n    }\n  }\n}"}},__namedExportsOrder=["CreateUserMutation","UpdateUserMutation","CreatePostMutation","UpdatePostMutation","CreateCommentMutation","CreateProductWithInputTypes","CreateOrderWithNestedInput","UpdateProductWithMultipleInputs","InferredMutationName","LimitedDepthMutation"];CreateUserMutation.parameters={...CreateUserMutation.parameters,docs:{...CreateUserMutation.parameters?.docs,source:{originalSource:"{\n  args: {\n    schema: createUserResponseSchema,\n    options: {\n      operationName: 'CreateUser',\n      variables: {\n        name: 'John Doe',\n        email: 'john@example.com',\n        password: 'secret123'\n      }\n    },\n    expectedOutput: `mutation CreateUser($name: String!, $email: String!, $password: String!) {\n  createUser(name: $name, email: $email, password: $password) {\n    id\n    name\n    email\n    createdAt\n  }\n}`\n  },\n  play: async ({\n    canvasElement\n  }) => {\n    const canvas = within(canvasElement);\n\n    // Get the generated output\n    const mutationOutput = canvas.getByTestId('mutation-output');\n    const expectedOutput = canvas.getByTestId('expected-output');\n\n    // Normalize strings (remove whitespace) for comparison\n    const normalizeString = (str: string) => str.replace(/\\s+/g, '');\n    expect(normalizeString(mutationOutput.textContent || '')).toBe(normalizeString(expectedOutput.textContent || ''));\n  }\n}",...CreateUserMutation.parameters?.docs?.source}}},UpdateUserMutation.parameters={...UpdateUserMutation.parameters,docs:{...UpdateUserMutation.parameters?.docs,source:{originalSource:"{\n  args: {\n    schema: updateUserResponseSchema,\n    options: {\n      operationName: 'UpdateUser',\n      variables: {\n        id: 'user123',\n        name: 'John Updated',\n        email: 'john.updated@example.com',\n        isActive: true\n      }\n    },\n    expectedOutput: `mutation UpdateUser($id: String!, $name: String!, $email: String!, $isActive: Boolean!) {\n  updateUser(id: $id, name: $name, email: $email, isActive: $isActive) {\n    id\n    name\n    email\n    age\n    isActive\n    updatedAt\n  }\n}`\n  }\n}",...UpdateUserMutation.parameters?.docs?.source}}},CreatePostMutation.parameters={...CreatePostMutation.parameters,docs:{...CreatePostMutation.parameters?.docs,source:{originalSource:"{\n  args: {\n    schema: createPostResponseSchema,\n    options: {\n      operationName: 'CreatePost',\n      variables: {\n        title: 'My First Post',\n        content: 'This is the content of my first post',\n        authorId: 'user123',\n        published: true\n      }\n    },\n    expectedOutput: `mutation CreatePost($title: String!, $content: String!, $authorId: String!, $published: Boolean!) {\n  createPost(title: $title, content: $content, authorId: $authorId, published: $published) {\n    id\n    title\n    content\n    authorId\n    published\n    createdAt\n  }\n}`\n  }\n}",...CreatePostMutation.parameters?.docs?.source}}},UpdatePostMutation.parameters={...UpdatePostMutation.parameters,docs:{...UpdatePostMutation.parameters?.docs,source:{originalSource:"{\n  args: {\n    schema: updatePostResponseSchema,\n    options: {\n      operationName: 'UpdatePost',\n      variables: {\n        id: 'post123',\n        title: 'Updated Post Title',\n        published: true\n      }\n    },\n    expectedOutput: `mutation UpdatePost($id: String!, $title: String!, $published: Boolean!) {\n  updatePost(id: $id, title: $title, published: $published) {\n    id\n    title\n    content\n    published\n    updatedAt\n  }\n}`\n  }\n}",...UpdatePostMutation.parameters?.docs?.source}}},CreateCommentMutation.parameters={...CreateCommentMutation.parameters,docs:{...CreateCommentMutation.parameters?.docs,source:{originalSource:"{\n  args: {\n    schema: createCommentResponseSchema,\n    options: {\n      operationName: 'CreateComment',\n      variables: {\n        text: 'This is my comment',\n        postId: 'post123',\n        authorId: 'user123'\n      }\n    },\n    expectedOutput: `mutation CreateComment($text: String!, $postId: String!, $authorId: String!) {\n  createComment(text: $text, postId: $postId, authorId: $authorId) {\n    id\n    text\n    authorId\n    postId\n    createdAt\n  }\n}`\n  }\n}",...CreateCommentMutation.parameters?.docs?.source}}},CreateProductWithInputTypes.parameters={...CreateProductWithInputTypes.parameters,docs:{...CreateProductWithInputTypes.parameters?.docs,source:{originalSource:"{\n  args: {\n    schema: productSchema,\n    options: {\n      operationName: 'CreateProduct',\n      variables: {\n        productInput: {\n          name: 'New Product',\n          description: 'Product description',\n          price: 99.99,\n          categories: ['electronics', 'gadgets'],\n          attributes: {\n            color: 'black',\n            weight: 150\n          }\n        }\n      },\n      inputTypeMap: {\n        productInput: 'ProductInput'\n      }\n    },\n    expectedOutput: `mutation CreateProduct($productInput: ProductInput!) {\n  createProduct(productInput: $productInput) {\n    id\n    name\n    description\n    price\n    categories\n    attributes\n    stockQuantity\n    isAvailable\n    createdAt\n  }\n}`\n  }\n}",...CreateProductWithInputTypes.parameters?.docs?.source}}},CreateOrderWithNestedInput.parameters={...CreateOrderWithNestedInput.parameters,docs:{...CreateOrderWithNestedInput.parameters?.docs,source:{originalSource:"{\n  args: {\n    schema: createOrderResponseSchema,\n    options: {\n      operationName: 'CreateOrder',\n      variables: {\n        order: {\n          customerId: 'cust123',\n          items: [{\n            productId: 'prod1',\n            quantity: 2,\n            unitPrice: 10.99\n          }, {\n            productId: 'prod2',\n            quantity: 1,\n            unitPrice: 24.99\n          }],\n          shippingAddress: {\n            street: '123 Main St',\n            city: 'Anytown',\n            state: 'ST',\n            zipCode: '12345'\n          },\n          billingAddress: {\n            street: '123 Main St',\n            city: 'Anytown',\n            state: 'ST',\n            zipCode: '12345'\n          }\n        }\n      },\n      inputTypeMap: {\n        order: 'OrderInput'\n      }\n    },\n    expectedOutput: `mutation CreateOrder($order: OrderInput!) {\n  createOrder(order: $order) {\n    id\n    customerId\n    items {\n      productId\n      quantity\n      unitPrice\n    }\n    totalAmount\n    status\n    shippingAddressId\n    billingAddressId\n    createdAt\n  }\n}`\n  }\n}",...CreateOrderWithNestedInput.parameters?.docs?.source}}},UpdateProductWithMultipleInputs.parameters={...UpdateProductWithMultipleInputs.parameters,docs:{...UpdateProductWithMultipleInputs.parameters?.docs,source:{originalSource:"{\n  args: {\n    schema: productSchema,\n    options: {\n      operationName: 'UpdateProduct',\n      variables: {\n        id: 'prod123',\n        productData: {\n          name: 'Updated Product',\n          price: 129.99\n        },\n        stockData: {\n          quantity: 50,\n          isAvailable: true\n        }\n      }\n    },\n    expectedOutput: `mutation UpdateProduct($id: String!, $productData: ProductDataInput!, $stockData: StockDataInput!) {\n  updateProduct(id: $id, productData: $productData, stockData: $stockData) {\n    id\n    name\n    description\n    price\n    categories\n    attributes\n    stockQuantity\n    isAvailable\n    createdAt\n  }\n}`\n  }\n}",...UpdateProductWithMultipleInputs.parameters?.docs?.source}}},InferredMutationName.parameters={...InferredMutationName.parameters,docs:{...InferredMutationName.parameters?.docs,source:{originalSource:"{\n  args: {\n    schema: userSchema,\n    options: {\n      variables: {\n        name: 'John Doe',\n        email: 'john@example.com'\n      }\n    },\n    expectedOutput: `mutation($name: String!, $email: String!) {\n  user(name: $name, email: $email) {\n    id\n    name\n    email\n    age\n    isActive\n    address {\n      street\n      city\n      state\n      zipCode\n      country\n    }\n  }\n}`\n  }\n}",...InferredMutationName.parameters?.docs?.source}}},LimitedDepthMutation.parameters={...LimitedDepthMutation.parameters,docs:{...LimitedDepthMutation.parameters?.docs,source:{originalSource:"{\n  args: {\n    schema: userSchema,\n    options: {\n      operationName: 'CreateUser',\n      variables: {\n        userData: {\n          name: 'John Doe',\n          email: 'john@example.com',\n          address: {\n            street: '123 Main St',\n            city: 'Anytown',\n            state: 'ST',\n            zipCode: '12345'\n          }\n        }\n      },\n      maxDepth: 3\n    },\n    expectedOutput: `mutation CreateUser($userData: UserDataInput!) {\n  createUser(userData: $userData) {\n    id\n    name\n    email\n    age\n    isActive\n    address {\n      street\n      city\n      state\n      zipCode\n      country\n    }\n  }\n}`\n  }\n}",...LimitedDepthMutation.parameters?.docs?.source}}}},"./src/mutation.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{W:()=>createMutation,n:()=>processMutation});var _index__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/index.ts");function processMutation(schema,options={}){const{operationName,variables,maxDepth=10,inputTypeMap}=options,operation=operationName?` ${operationName}`:"",varsString=((variables,inputTypeMap)=>variables&&0!==Object.keys(variables).length?`(${Object.entries(variables).map((([key,value])=>{if(inputTypeMap&&inputTypeMap[key])return`$${key}: ${inputTypeMap[key]}!`;let type="String";return"number"==typeof value?type="Int":"boolean"==typeof value?type="Boolean":"object"==typeof value&&null!==value&&(type=`${key.charAt(0).toUpperCase()+key.slice(1)}Input`),`$${key}: ${type}!`})).join(", ")})`:"")(variables,inputTypeMap),fieldArgs=(0,_index__WEBPACK_IMPORTED_MODULE_0__.ON)(variables),mutationField=(0,_index__WEBPACK_IMPORTED_MODULE_0__.Jf)(schema,operationName);return`${_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Mutation}${operation}${varsString} {\n  ${mutationField}${fieldArgs} {\n${(0,_index__WEBPACK_IMPORTED_MODULE_0__.fO)(schema,_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Mutation,options,2)}  }\n}`}function createMutation(schema,options={}){return schema.toGQL(_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Mutation,options)}},"./src/query.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{O:()=>processQuery,V:()=>createQuery});var _index__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/index.ts");function processQuery(schema,options={}){const{operationName,variables,maxDepth=10}=options,operation=operationName?` ${operationName}`:"",varsString=(0,_index__WEBPACK_IMPORTED_MODULE_0__.Hh)(variables,options.inputTypeMap),fieldArgs=(0,_index__WEBPACK_IMPORTED_MODULE_0__.ON)(variables),queryField=(0,_index__WEBPACK_IMPORTED_MODULE_0__.Jf)(schema,operationName);return`${_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Query}${operation}${varsString} {\n  ${queryField}${fieldArgs} {\n${(0,_index__WEBPACK_IMPORTED_MODULE_0__.fO)(schema,_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Query,options,2)}  }\n}`}function createQuery(schema,options={}){return schema.toGQL(_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Query,options)}},"./src/subscription.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{K:()=>createSubscription,d:()=>processSubscription});var _index__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/index.ts");function processSubscription(schema,options={}){const{operationName,variables,maxDepth=10}=options,operation=operationName?` ${operationName}`:"",varsString=(0,_index__WEBPACK_IMPORTED_MODULE_0__.Hh)(variables,options.inputTypeMap),fieldArgs=(0,_index__WEBPACK_IMPORTED_MODULE_0__.ON)(variables),subscriptionField=(0,_index__WEBPACK_IMPORTED_MODULE_0__.Jf)(schema,operationName);return`${_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Subscription}${operation}${varsString} {\n  ${subscriptionField}${fieldArgs} {\n${(0,_index__WEBPACK_IMPORTED_MODULE_0__.fO)(schema,_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Subscription,options,2)}  }\n}`}function createSubscription(schema,options={}){return schema.toGQL(_index__WEBPACK_IMPORTED_MODULE_0__.Nt.Subscription,options)}}}]);