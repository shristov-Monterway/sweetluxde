# IGS Commerce

## TODOS
- Make the validation rules for `/product/createUpdate` in AdminRoutes more strict.
- Add product attribute data in CartType and WishListType (and all endpoints or components using them).
- Add product attributes data in ProductCard, ProductInfo (input for choosing attribute option).
- Add functionality for registering only with invitation code.
- Add information on Stripe checkout page for the product variation (not only product).
- Add address property in user.
- Add weight property to product variation.
- Add "Add to cart" button on WishlistProductCard.
- Create AccountInfo component.
- Create import of products from CSV file. (extend the admin.tsx page)
- Remove products, product variations and product attributes, which are selected inside cart, but doesn't exist

## Requirements
1. Node 20
2. Firebase CLI: 13.6.0
3. Stripe CLI: 1.21.8

## Firebase installation
1. Authenticate into Firebase CLI: `firebase login`

## Stripe installation
1. Authenticate into Stripe CLI: `stripe login`

## Web installation
1. Open `web`: `cd web`
2. Install dependencies: `npm i`
3. Run local server: `npm run dev`

## Firebase installation
1. Open `functions`: `cd firebase/functions`
2. Install dependencies: `npm i`
3. Build cloud functions: `npm run build:watch`
4. Run emulators: `npm run dev`
   - Additional for Stripe webhook: `npm run stripe:webhook`
5. Import currencies:
   - Open scheduled functions shell: `npm run shell`
   - Run scheduled function to import supported currencies: `firebase > schedule_paymentCurrenciesSync()`
6. Import products:
    - Open scheduled functions shell: `npm run shell`
    - Run scheduled function to generate one product: `firebase > schedule_productFixtureCreate()`

## Customizations:
1. Change following properties inside `web/src/services/Firebase/config.json`
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`
   - `measurementId`
2. Change following properties inside `firebase/.firebaserc`
   - `projects.default`
3. Change the project name in URL of command `stripe:webhook` inside `firebase/functions/package.json`
4. Change the project configuration inside `firebase/functions/src/Config.ts`

## Project setup
1. Go to `https://console.firebase.google.com/`
2. Create new project
3. Check the `Enable Google Analytics for this project` checkbox
4. Click `Continue`
5. Under `Choose or create a Google Analytics account` choose `Default Account for Firebase`
6. Click `Create project`
7. Wait few seconds to create project
8. Click `Continue` when project is ready
9. Go to `https://console.firebase.google.com/project/###_PROJECT_ID_###/settings/general`
10. Under `Your apps` click on the `tag` icon
11. Under `App nickname` write `Web`
12. Click on `Register app`
13. Copy the `firebaseConfig` object and place in the JSON file `firebase/config.json`
14. Click on `Continue to console`
15. From the sidebar choose `Build`
16. Then `Authentication`
17. Click `Get started`
18. Choose the sign-in methods you want to enable
19. `Google`
     - Click on the `Enable` toggle
     - Under `Support email for project` choose one of the emails, which will be used for support
     - Click `Save`
20. From the sidebar choose `Build`
21. Then `Firestore Database`
22. Click `Create database`
23. Choose `Start in production mode`
24. Click `Next`
25. Under `Cloud Firestore location` choose region (recommended `europe-west3`)
26. Click `Enable`
27. From the sidebar choose `Build`
28. Then `Functions`
29. Click `Upgrade project`
30. Under `Your billing accounts` choose the account, which credit card will be charged
31. Click `Continue`
32. Under `Budget amount in USD` write the budget for the cloud functions (recommended `10`)
33. Click `Continue`
34. Click `Purchase`
35. When ready close the modal
36. Click `Get started`
37. Click `Continue`
38. Click `Finish`
39. Go to `https://console.cloud.google.com/iam-admin/serviceaccounts?authuser=0&hl=en&project=###_PROJECT_ID_###`
40. Click on the email where `Name` is `App Engine default service account`
41. Click on `Keys`
42. Click on `ADD KEY`
43. Click on `Create new key`
44. Select `JSON`
45. Click `Create`
46. JSON file will be automatically downloaded
47. Copy the content of the downloaded file
48. Create new repository secret with name `GCP_SA_KEY` and content the copied content of the JSON file
49. Go to `https://console.cloud.google.com/apis/library/cloudbuild.googleapis.com?project=###_PROJECT_ID_###`
50. Click `ENABLE`
51. Go to `https://console.cloud.google.com/apis/library/artifactregistry.googleapis.com?project=###_PROJECT_ID_###`
52. Click `ENABLE`
53. Go to `https://console.cloud.google.com/apis/library/iam.googleapis.com?project=###_PROJECT_ID_###`
54. Click `ENABLE`
55. Go to `https://console.developers.google.com/apis/api/cloudbilling.googleapis.com/overview?project=###_PROJECT_ID_###`
56. Click `ENABLE`
57. Open `https://console.cloud.google.com/iam-admin/iam?project=###_PROJECT_ID_###`
58. Click on the `pencil` icon on the line where `Name` is `App Engine default service account`
59. Make sure following roles are assigned:
    - `Service Account User`
    - `Cloud Functions Developer`
    - `Cloud Scheduler Admin`
    - `Secret Manager Viewer`
    - `Firebase Rules Admin`
    - `Firebase Functions Admin`
    - `Cloud Datastore Index Admin`
    - `Firebase Hosting Admin`
60. Click `SAVE`
61. Go to `https://vercel.com/`
62. Click `Add New`
63. Choose `Project`
64. Click `Import` on the project repository
65. Under `Root Directory` click `Edit`
66. Click on the circle next to the `web` folder
67. Click `Continue`
68. Under `Framework Preset` choose `Next.js`
69. Click `Deploy`
70. Go to `https://vercel.com/`
71. Click on the project
72. Click `Settings`
73. Click `Domains`
74. Copy the domain
75. Go to `https://console.firebase.google.com/project/###_PROJECT_ID_###/authentication/settings`
76. Click `Authorized domains`
77. Click `Add domain`
78. Paste the copied domain from step 71
79. Click `Add`
