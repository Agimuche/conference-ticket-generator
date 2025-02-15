import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import localforage from 'localforage';


const TicketForm = ({ onSubmit }) => {
  const initialValues = {
    name: '',
    email: '',
    photo: ''
  };

  // Load saved form data from local storage
  useEffect(() => {
    const loadSavedData = async () => {
      const savedData = await localforage.getItem('ticketFormData');
      if (savedData) {
        Object.assign(initialValues, savedData);
      }
    };
    loadSavedData();
  }, [initialValues]);



  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    photo: Yup.string()
      .required('Photo URL is required')
      .url('Please enter a valid URL')
      .matches(
        /\.(jpeg|jpg|png)$/i,
        'URL must point to a valid image (JPEG, JPG, PNG)'
      )

  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, actions) => {
        // Save form data to local storage
        await localforage.setItem('ticketFormData', values);
        onSubmit(values, actions);
      }}

    >
      {({ setFieldValue, isSubmitting }) => (
        <Form aria-label="Ticket generation form">
          <div className="form-group">
            <label htmlFor="name">Full Name:</label>
            <Field 
              type="text" 
              name="name" 
              id="name"
              aria-required="true"
            />
            <ErrorMessage name="name" component="div" className="error" />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address:</label>
            <Field 
              type="email" 
              name="email" 
              id="email"
              aria-required="true"
            />
            <ErrorMessage name="email" component="div" className="error" />
          </div>

          <div className="form-group">
            <label htmlFor="photo">Avatar URL:</label>
            <Field
              type="url"
              name="photo"
              id="photo"
              placeholder="Enter Cloudinary or image URL"
              aria-required="true"
              aria-describedby="photoHelp"
            />
            <small id="photoHelp" className="form-text">
              Enter a valid image URL (JPEG, JPG, PNG)
            </small>
            <ErrorMessage name="photo" component="div" className="error" />
          </div>


          <button 
            type="submit" 
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Generate Ticket'}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default TicketForm;
