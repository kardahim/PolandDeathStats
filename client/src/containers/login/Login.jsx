import React from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../helpers/AuthContext'
import { useContext, useEffect } from 'react';
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import TextField from '../../components/textField/TextField'
import Button from '../../components/button/Button'
import './login.scss'

function Login() {
    let navigate = useNavigate();
    const { setAuthState } = useContext(AuthContext);
    
    const initialValues = {
        email: '',
        password: ''
    }

    useEffect(()=>{
        document.title = "Logowanie"
      })

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("To nie jest email")
            .required('Pole jest wymagane'),
        password: Yup.string()
            .required('Pole jest wymagane')
    })

    const onSubmit = (data) => {
        // TODO: submit to server
        //console.log("login submit button pressed")

        axios.post("http://localhost:3001/users/login", data).then((response) => {
            if (response.data.error) {
                alert(response.data.error);
            }
            else {
                localStorage.setItem("accessToken", response.data.token)
                setAuthState({
                    email: response.data.email,
                    id: response.data.id,
                    status: true
                });
                navigate(`/`)
            }
        }).catch(error => console.error(error))

    }


    return (
        <div className='login-container'>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}>
                <Form className='login-form'>
                    <section className='header'>
                        login
                    </section>
                    {/* email */}
                    <TextField
                        autoComplete='username'
                        name='email'
                        className='login-input'
                        placeholder='Email'
                    />
                    {/* password */}
                    <TextField
                        autoComplete='current-password'
                        name='password'
                        className='login-input'
                        placeholder='Hasło'
                        type='password' />
                    {/* submit button */}
                    <Button
                        type='submit'
                        text='Zaloguj się' />
                </Form>
            </Formik>
        </div>
    )
}

export default Login