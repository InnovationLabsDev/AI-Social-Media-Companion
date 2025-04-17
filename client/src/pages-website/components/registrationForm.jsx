import React, { useState } from 'react';
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaTwitter, FaPinterest } from 'react-icons/fa';
import classes from '../../styles/registrationForm.module.css';
import { Link } from 'react-router-dom';
// import classes from '../../styles/loginForm.module.css';

function RegistrationForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [businessType, setBusinessType] = useState('');
    const [preferredPostType, setPreferredPostType] = useState('');
    const [postFrequency, setPostFrequency] = useState('');
    const [preferredTone, setPreferredTone] = useState('');
    const [website, setWebsite] = useState('');
    const [permissions, setPermissions] = useState({
        gallery: false,
        calendar: false,
        location: false
    });
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [error, setError] = useState('');
    const [currentStep, setCurrentStep] = useState(1);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password || !retypePassword || !name) {
            setError('All fields are required');
            return;
        }
        if (password !== retypePassword) {
            setError('Passwords do not match');
            return;
        }
        setError('');
        alert('Registration successful');
    };

    const handlePermissionsChange = (e) => {
        const { name, checked } = e.target;
        setPermissions((prevPermissions) => ({
            ...prevPermissions,
            [name]: checked
        }));
    };

    const togglePlatformSelection = (platform) => {
        setSelectedPlatforms((prevPlatforms) =>
            prevPlatforms.includes(platform)
                ? prevPlatforms.filter((item) => item !== platform)
                : [...prevPlatforms, platform]
        );
    };

    const nextStep = () => {
        setCurrentStep(prevStep => prevStep + 1);
    };

    const prevStep = () => {
        setCurrentStep(prevStep => prevStep - 1);
    };

    return (
        <div className={classes.container}>
            <div className={classes.register_box}>
                <h2>Register</h2>
                {error && <p className={classes.error_message}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    {/* Section 1: Credentials */}
                    {currentStep === 1 && (
                        <div>
                            <h3>Section 1: Credentials</h3>
                            <div className={classes.input_group}>
                                <label>Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className={classes.input_group}>
                                <label>Email</label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className={classes.input_group}>
                                <label>Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className={classes.input_group}>
                                <label>Retype Password</label>
                                <input
                                    type="password"
                                    placeholder="Retype your password"
                                    value={retypePassword}
                                    onChange={(e) => setRetypePassword(e.target.value)}
                                />
                            </div>

                            <div className={classes.input_group}>
                                <label>Business Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your business name"
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                />
                            </div>

                            <div className={classes.input_group}>
                                <label>Business Type</label>
                                <input
                                    type="text"
                                    placeholder="Enter your business type"
                                    value={businessType}
                                    onChange={(e) => setBusinessType(e.target.value)}
                                />
                            </div>

                            <div className={classes.button_group}>
                                <button type="button" onClick={nextStep} className={`${classes.small_button} ${classes.next_button}`}>
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Section 2: Posting Preferences */}
                    {currentStep === 2 && (
                        <div>
                            <h3>Section 2: Posting Preferences</h3>
                            <div className={classes.input_group}>
                                <label>Preferred Post Type</label>
                                <select
                                    value={preferredPostType}
                                    onChange={(e) => setPreferredPostType(e.target.value)}
                                >
                                    <option value="">Select Post Type</option>
                                    <option value="text">Text</option>
                                    <option value="photo_short_caption">Photo with Short Caption</option>
                                    <option value="photo_long_caption">Photo with Long Caption</option>
                                </select>
                            </div>

                            <div className={classes.input_group}>
                                <label>Post Frequency</label>
                                <select
                                    value={postFrequency}
                                    onChange={(e) => setPostFrequency(e.target.value)}
                                >
                                    <option value="">Select Post Frequency</option>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>

                            <div className={classes.input_group}>
                                <label>Preferred Tone</label>
                                <select
                                    value={preferredTone}
                                    onChange={(e) => setPreferredTone(e.target.value)}
                                >
                                    <option value="">Select Tone</option>
                                    <option value="formal">Formal</option>
                                    <option value="casual">Casual</option>
                                    <option value="friendly">Friendly</option>
                                    <option value="professional">Professional</option>
                                </select>
                            </div>

                            <div className={classes.input_group}>
                                <label>Website (Optional)</label>
                                <input
                                    type="url"
                                    placeholder="Enter your website URL"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                />
                            </div>

                            <div className={classes.button_group}>
                                <button type="button" onClick={prevStep} className={classes.small_button}>
                                    Previous
                                </button>
                                <button type="button" onClick={nextStep} className={classes.small_button}>
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Section 3 & 4: Permissions and Social Media Connections */}
                    {currentStep === 3 && (
                        <div>
                            <h3>Section 3: Permissions</h3>
                            <div className={classes.permissions}>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="gallery"
                                        checked={permissions.gallery}
                                        onChange={handlePermissionsChange}
                                    />
                                    Gallery Access
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="calendar"
                                        checked={permissions.calendar}
                                        onChange={handlePermissionsChange}
                                    />
                                    Calendar Access
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="location"
                                        checked={permissions.location}
                                        onChange={handlePermissionsChange}
                                    />
                                    Location Access
                                </label>
                            </div>

                            <div className={classes.social_media_section}>
                                <h3>Section 4: Social Media Connections</h3>
                                {/* Social Media Items */}
                                {[
                                    { platform: 'Instagram', icon: <FaInstagram /> },
                                    { platform: 'Facebook', icon: <FaFacebookF /> },
                                    { platform: 'LinkedIn', icon: <FaLinkedinIn /> },
                                    { platform: 'Twitter', icon: <FaTwitter /> },
                                    { platform: 'Pinterest', icon: <FaPinterest /> }
                                ].map(({ platform, icon }) => (
                                    <div key={platform} className={classes.social_media_item}>
                                        <button
                                            className={classes.social_media_button}
                                            onClick={() => togglePlatformSelection(platform)}
                                            aria-label={`Connect ${platform}`}
                                        >
                                            {icon} Connect to {platform}
                                        </button>

                                        <input
                                            type="checkbox"
                                            checked={selectedPlatforms.includes(platform)}
                                            onChange={() => togglePlatformSelection(platform)}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className={classes.button_group}>
                                <button type="button" onClick={prevStep} className={classes.small_button}>
                                    Previous
                                </button>
                                <button type="submit" className={classes.small_button}>
                                    Submit
                                </button>
                            </div>
                        </div>
                    )}
                </form>
                <Link to="/" className={classes.login_link}>Already have an account? Log in</Link>
            </div>
        </div>
    );
}

export default RegistrationForm;
