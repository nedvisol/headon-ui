import type { GetServerSideProps, NextPage, NextPageContext } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { RenderView } from '@headon/react';
import { HeadOnAttributes, HeadOnGetServerSideProps, withHeadOn } from '@headon/next';
import styles from '../styles/Home.module.css'

interface IHomeProps {  
  additionalProp: string
}

const _Home: NextPage<IHomeProps & HeadOnAttributes> = (props) => {    
  return (
    <div>
      <Link href="/">Index</Link>
      <div>{props.additionalProp}</div>
      <RenderView view={props.view} />  
      <RenderView name="/home#sub" />
    </div>
  )
}

const homeGetServerSideProps:GetServerSideProps = async (ctx) => {
    return {
        props: {
          additionalProp: 'hello'
        }        
    }
}


export const getServerSideProps = HeadOnGetServerSideProps(homeGetServerSideProps, ['/home#sub']);


export default withHeadOn(_Home);
