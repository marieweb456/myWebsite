import styles from './index.module.css';
import imgPortrait from '../../assets/images/tof_about.jpg';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { FaTwitter, FaTumblr, FaInstagram } from 'react-icons/fa';

const About = () => {
  return (
    <div className={styles.contentPageAbout}>
      <div className={styles.contentPage}>
        <div className={styles.containerImgTxt}>
          <div className={styles.contentImg}>
            <LazyLoadImage effect='blur' threshold='3' src={imgPortrait} alt='artist portrait' />
          </div>
          <div className={styles.contentText}>
            <div className={styles.contentParag}>
              <p>
                I'm a various medium color artist in my mid twenties, based in the southwest suburbs
                of Paris. My name is Marie!
              </p>
              <p>
                I briefly went to Gobelins' animation school before jumping into the professional
                pool; Since, I've worn the shoes of an illustrator, an art teacher, and explored and
                learned from all sorts of art-related jobs which came my way.
              </p>
              <p>
                I love injecting colors into pieces and help convey emotions to an audience through
                the lens of our beloved visible spectrum, I find it to be a passionating craft. I
                love helping build an universe, with its details, to help make it more and more
                believable, sometimes more unique, but above all always loveable.
              </p>
              <p>
                Besides drawing, I find my hobbies in music, a little bit of video gaming, knitting,
                wildlife photgraphy. As well, some of my free time I had the chance to dedicate to
                charities and structures for mental health, especially regarding young neurodiverse
                people, which is a topic dear to my heart. I'm curious, dedicated and love working
                with people, discovering all the many things I can still be taught in this lifetime!
                I'm always available for a friendly chat on social media, and can be reached for
                work inquiries through my email.
              </p>
            </div>
            <div className={styles.contentSocialIcn}>
              <div className={styles.contentSocialIcnTxt}>
                <h3>PROFESSIONAL INQUIRIES</h3>
                <p>
                  <a href='mailto:ma.ponceau@gmail.com'>ma.ponceau@gmail.com</a>
                </p>
              </div>
              <div className={styles.contentSocialIcnicones}>
                <a
                  href='https://twitter.com/marieponceau'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <FaTwitter size={18} />
                </a>
                <a
                  href='https://marieponceau.tumblr.com/'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <FaTumblr size={18} />
                </a>
                <a
                  href='https://www.instagram.com/mqponpon/'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <FaInstagram size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
