const { Client } = Appwrite;
const client = new Client();
const signupForm = document.querySelector('#signUpForm')
const loginForm = document.querySelector('#loginForm')
const sellForm = document.querySelector('#sellForm')
const products = document.querySelector('#products')
const loginDialog = document.querySelector('#loginDialog')
const signupDialog = document.querySelector('#signupDialog')
const logout = document.querySelector('#logout')
console.log('hi')
client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('647cb04047acf20fd97e')

const account = new Appwrite.Account(client);

const authHandler = () => {
    if (localStorage['cookieFallback']) {
        document.querySelector('.auth-btn-wrapper') && (document.querySelector('.auth-btn-wrapper').style.display = "none")
        logout && (logout.style.display = "flex")
    } else {
        document.querySelector('.auth-btn-wrapper') && (document.querySelector('.auth-btn-wrapper').style.display = "flex")
        logout && (logout.style.display = "none")
    }
}

logout?.addEventListener('click', ()=>{
    localStorage.clear()
    location.reload()
})

const populateProducts = async() => {
    const databases = new Appwrite.Databases(client);
    databases.listDocuments('647ccc20de47586cb1ca', '647ccc34d88785a2d052', []).then(res=>{
        console.log(res)
        products.innerHTML = Array.from(res.documents).map(v=>{
            return ` <div class="max-w-sm w-full card shadow-2xl m-5 bg-base-100 justify-center items-center ">
            <div class="h-[30vh] overflow-hidden flex items-center justify-center">
              <img src="${v.photo}" alt="${v.category}" class="w-full  ">
              </div>
            <div class="card-body w-full">
              <h2 class="card-title">${v.category}</h2>
              <div class="text-xl">₹ ${v.price}</div>
              <p>${v.description}</p>
              <small>Seller: ${v.name}</small>
              <div class="card-actions  mt-2 w-full">
              ${localStorage["cookieFallback"] ? `<a href="https://wa.me/91${v.phone}?text=Hi, I am interested in buying ${v.category} (${v.description})." class="btn shadow-lg btn-success w-full">BUY NOW</a>` : '<a class="btn btn-error w-full" href="index.html">Login To Buy</a>'}
              </div>
            </div>
          </div>`
        })
    }).catch(err=>console.log(err))
}

signupForm?.addEventListener('submit', async (e) => {
    e.preventDefault()
    try {
        if(!signupForm.querySelector('#email').value.includes('@vitstudent.ac.in')){
            alert('Enter Valid VIT Email Address')
            return
        }
        await account.create(
            Appwrite.ID.unique(),
            signupForm.querySelector('#email').value,
            signupForm.querySelector('#password').value
        );
        alert("Created Account successfully")
        signupDialog.close()

    } catch (error) {
        console.log(error)
        alert('Seems like you already have an account. Login Instead')
        signupDialog.close()
    } finally {
        authHandler()
    }
})
loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault()
    try {
        if(!loginForm.querySelector('#email').value.includes('@vitstudent.ac.in')){
            alert('Enter Valid VIT Email Address')
            return
        }
        await account.createEmailSession(
            loginForm.querySelector('#email').value,
            loginForm.querySelector('#password').value
        );
        alert('Logged in successfully')
        loginDialog.close()
    } catch (error) {
        alert('Invalid credentials, try again.')
        loginDialog.close()
    }  
})

sellForm?.addEventListener('submit', async (e) => {
    e.preventDefault()
    const inputIds = ["desc", "price", "username", "phone"]
    const [description, price, name, phone] = inputIds.map((v) => {
        return document.querySelector('#' + v).value
    })
    const category = document.querySelector('input[name="radio-10"]:checked').value;
    const photoFile = document.querySelector('#photo').files[0]
    const databases = new Appwrite.Databases(client);
    const storage = new Appwrite.Storage(client);
    storage.createFile('647ccd6f57d834a0b8eb', Appwrite.ID.unique(), photoFile).then((response) => {
        const photo = `https://cloud.appwrite.io/v1/storage/buckets/647ccd6f57d834a0b8eb/files/${response.$id}/view?project=647cb04047acf20fd97e`
        databases.createDocument('647ccc20de47586cb1ca', '647ccc34d88785a2d052',
            Appwrite.ID.unique(),
            {
                category,
                photo,
                description,
                price,
                name,
                phone
            }
        )
    }).then(() => {
        alert('Successfully added product')
        window.location.reload()
    }).catch((error) => {
        console.log(error);
    });
})

products && populateProducts()
authHandler()
localStorage['theme'] && document.querySelector('html').setAttribute("data-theme", localStorage['theme'].toLowerCase());

loginDialog?.addEventListener('click', function (event) {
    var rect = loginDialog.getBoundingClientRect();
    var isInDialog=(rect.top <= event.clientY && event.clientY <= rect.top + rect.height
      && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
    if (!isInDialog) {
        loginDialog.close();
    }
});
signupDialog?.addEventListener('click', function (event) {
    var rect = signupDialog.getBoundingClientRect();
    var isInDialog=(rect.top <= event.clientY && event.clientY <= rect.top + rect.height
      && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
    if (!isInDialog) {
        signupDialog.close();
    }
});