// Bootstrap form validation
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

// Additional client-side validation for better UX
document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.needs-validation');
  if (form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        validateField(this);
      });
      
      input.addEventListener('input', function() {
        if (this.classList.contains('is-invalid') && this.value.trim() !== '') {
          validateField(this);
        }
      });
    });

    // Special handling for description field with word count
    const descriptionField = form.querySelector('textarea[name="listing[description]"]');
    if (descriptionField) {
      const wordCountDiv = document.createElement('div');
      wordCountDiv.className = 'form-text text-muted';
      wordCountDiv.id = 'word-count';
      descriptionField.parentNode.appendChild(wordCountDiv);
      
      descriptionField.addEventListener('input', function() {
        const wordCount = this.value.trim().split(/\s+/).filter(word => word.length > 0).length;
        const wordCountDiv = document.getElementById('word-count');
        wordCountDiv.textContent = `Word count: ${wordCount}/50 minimum`;
        
        if (wordCount >= 10) {
          wordCountDiv.className = 'form-text text-success';
          this.classList.remove('is-invalid');
          this.classList.add('is-valid');
        } else if (wordCount > 0) {
          wordCountDiv.className = 'form-text text-warning';
          this.classList.remove('is-valid');
          this.classList.add('is-invalid');
        } else {
          wordCountDiv.className = 'form-text text-muted';
          this.classList.remove('is-valid', 'is-invalid');
        }
      });
    }
  }

  function validateField(field) {
    const value = field.value.trim();
    
    if (value === '') {
      field.classList.add('is-invalid');
      field.classList.remove('is-valid');
      return false;
    }

    // Custom validation based on field type
    let isValid = true;
    
    if (field.name === 'listing[title]') {
      isValid = value.length >= 3 && value.length <= 100;
    } else if (field.name === 'listing[price]') {
      const price = parseInt(value);
      isValid = !isNaN(price) && price >= 1 && price <= 1000000;
    } else if (field.name === 'listing[country]') {
      isValid = /^[a-zA-Z\s]+$/.test(value) && value.length >= 2;
    } else if (field.name === 'listing[location]') {
      isValid = value.length >= 2;
    } else if (field.name === 'listing[image]' && value !== '') {
      const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      isValid = urlRegex.test(value);
    }

    if (isValid) {
      field.classList.remove('is-invalid');
      field.classList.add('is-valid');
    } else {
      field.classList.remove('is-valid');
      field.classList.add('is-invalid');
    }
    
    return isValid;
  }
});