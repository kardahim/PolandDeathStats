import React from 'react'
import './register.scss'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import TextField from '../../components/textField/TextField'
import Button from '../../components/button/Button'

function Register() {
    let navigate = useNavigate();
    const [emailRegistered, setEmailRegistered] = useState("false")

    const initialValues = {
        firstname: '',
        lastname: '',
        email: '',
        password: ''
    }

    useEffect(()=>{
        document.title = "Rejestracja"
      })

    // TODO: add validation
    const validationSchema = Yup.object().shape({
        firstname: Yup.string()
            .required('Pole jest wymagane'),
        lastname: Yup.string()
            .required('Pole jest wymagane'),
        email: Yup.string()
            .email("To nie jest email")
            .required('Pole jest wymagane'),
        password: Yup.string()
            // TODO: add password regex
            .required('Pole jest wymagane')
    })

    const onSubmit = (data) => {
        // TODO: submit to server
        //console.log("register submit button pressed")

        axios.get(`http://localhost:3001/users/email/${data.email}`).then((response) => {
            if(response.data !== null)
            {
                setEmailRegistered("true");
            }
            else {
                axios.post("http://localhost:3001/users/register", data).then(() => {
                navigate(`/login`)
                })
            }
        });
    }

    return (
        <div className='register-container'>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}>
                <Form className='register-form'>
                    <section className='header'>
                        rejestracja
                    </section>
                    {/* firstname */}
                    <TextField
                        name='firstname'
                        className='register-input'
                        placeholder='Imię'
                    />
                    {/* lastname */}
                    <TextField
                        name='lastname'
                        className='register-input'
                        placeholder='Nazwisko'
                    />
                    {/* email */}
                    <TextField
                        autoComplete='username'
                        name='email'
                        className='register-input'
                        placeholder='Email'
                    />
                    {/* password */}
                    <TextField
                        autoComplete='current-password'
                        name='password'
                        className='register-input'
                        placeholder='Hasło'
                        type='password' />
                    {/* submit button */}
                    <Button
                        type='submit'
                        text='Zarejestruj się' />
                </Form>
            </Formik>
        </div>
    )
}

export default Register