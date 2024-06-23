function createUser () {
  const fileInput = document.getElementById('createUserImage')
  const file = fileInput.files[0]
  const reader = new FileReader()
  reader.onload = function (event) {
    const base64Image = event.target.result.split(',')[1]
    fetch('http://localhost:3000/user/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ base64Image })
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        alert('User created with ID: ' + data.user_id)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }
  reader.readAsDataURL(file)
}

function compareImages () {
  const referenceFileInput = document.getElementById('compareReferenceImage')
  const queryFileInput = document.getElementById('compareQueryImage')
  const referenceFile = referenceFileInput.files[0]
  const queryFile = queryFileInput.files[0]
  const reader = new FileReader()
  reader.onload = function (event) {
    const base64referenceImage = event.target.result.split(',')[1]
    const reader2 = new FileReader()
    reader2.onload = function (event) {
      const base64queryImage = event.target.result.split(',')[1]
      fetch('http://localhost:3000/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          base64referenceImage,
          base64queryImage
        })
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          document.getElementById('similarityResult').textContent =
            data.similarity.toFixed(2) + '%'
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    }
    reader2.readAsDataURL(queryFile)
  }
  reader.readAsDataURL(referenceFile)
}

function searchSimilarImages () {
  const fileInput = document.getElementById('searchQueryImage')
  const file = fileInput.files[0]
  const threshold = document.getElementById('threshold').value
  const limit = document.getElementById('limit').value
  const reader = new FileReader()
  reader.onload = function (event) {
    const base64queryImage = event.target.result.split(',')[1]
    fetch('http://localhost:3000/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        threshold,
        limit,
        base64queryImage
      })
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        const searchResults = document.getElementById('searchResults')
        searchResults.innerHTML = ''
        data.similars.forEach((similar) => {
          const figure = document.createElement('figure')
          figure.classList.add(
            'image',
            'is-128x128',
            'is-square',
            'has-text-centered'
          )

          const imageElement = document.createElement('img')
          imageElement.src = 'http://localhost:3000/image/' + similar.id
          imageElement.classList.add('is-rounded')

          const distanceElement = document.createElement('div')
          distanceElement.classList.add('has-text-centered', 'mt-2')
          distanceElement.textContent = `Similarity: ${similar.similarity}%`

          figure.appendChild(imageElement)

          const container = document.createElement('div')
          container.classList.add(
            'is-flex',
            'is-flex-direction-column',
            'is-align-items-center'
          )
          container.appendChild(figure)
          container.appendChild(distanceElement)

          searchResults.appendChild(container)
        })
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }
  reader.readAsDataURL(file)
}

function previewImage (event, previewElementId) {
  const file = event.target.files[0]
  const reader = new FileReader()
  reader.onload = function (e) {
    const previewElement = document.getElementById(previewElementId)
    previewElement.src = e.target.result
  }
  reader.readAsDataURL(file)
}

document
  .getElementById('createUserImage')
  .addEventListener('change', function (event) {
    previewImage(event, 'createUserPreview')
  })

document
  .getElementById('compareReferenceImage')
  .addEventListener('change', function (event) {
    previewImage(event, 'compareReferencePreview')
  })

document
  .getElementById('compareQueryImage')
  .addEventListener('change', function (event) {
    previewImage(event, 'compareQueryPreview')
  })

document
  .getElementById('searchQueryImage')
  .addEventListener('change', function (event) {
    previewImage(event, 'searchQueryPreview')
  })

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tabs ul li')
  const tabContents = document.querySelectorAll('.tab-content')

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((item) => item.classList.remove('is-active'))
      tab.classList.add('is-active')

      const target = tab.dataset.tab
      tabContents.forEach((content) => {
        if (content.id === target) {
          content.classList.add('active')
        } else {
          content.classList.remove('active')
        }
      })
    })
  })
})

document.addEventListener('DOMContentLoaded', () => {
  const compareReferenceImage = document.getElementById(
    'compareReferenceImage'
  )
  const compareQueryImage = document.getElementById('compareQueryImage')
  const compareReferencePreview = document.getElementById(
    'compareReferencePreview'
  )
  const compareQueryPreview = document.getElementById('compareQueryPreview')
  const similarityResult = document.getElementById('similarityResult')

  // Handle image preview for reference image
  compareReferenceImage.addEventListener('change', () => {
    const file = compareReferenceImage.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        compareReferencePreview.src = e.target.result
      }
      reader.readAsDataURL(file)
    }
  })

  // Handle image preview for query image
  compareQueryImage.addEventListener('change', () => {
    const file = compareQueryImage.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        compareQueryPreview.src = e.target.result
      }
      reader.readAsDataURL(file)
    }
  })

  // Handle compare images button
  document
    .getElementById('compareImagesButton')
    .addEventListener('click', compareImages)
})
