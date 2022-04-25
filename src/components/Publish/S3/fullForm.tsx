// import { Form } from 'formik'
// import Upload from './upload_form'
// import styles from '../index.module.css'
// import Actions from '../Actions'
// import { Steps } from '../Steps'
// import Navigation from '../Navigation'
// import { DownloadContext } from '../../../@context/useDownloadUrl'
// import { useState } from 'react'
//
// export default function FullForm(props){
//
//   const [downloadUrl, setDownloadUrl] = useState("");
//   const value = { downloadUrl, setDownloadUrl };
//
//   const { className, ref, feedback, scrollToRef, did } = props;
//
//   return (
//     <DownloadContext.Provider value={value}>
//       <Upload />
//       <Form className={styles.form} ref={scrollToRef}>
//         <Navigation />
//         <Steps feedback={feedback} />
//         <Actions scrollToRef={scrollToRef} did={did} />
//       </Form>
//     </DownloadContext.Provider>
//   );
// }
