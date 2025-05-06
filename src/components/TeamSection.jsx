import { Github, Linkedin, Mail } from "lucide-react"
import team1 from "../assets/team/team1.jpg"
import team2 from "../assets/team/team2.jpg"
import team3 from "../assets/team/team3.jpg"
import team4 from "../assets/team/team4.jpg"

export default function TeamSection() {
    const teamMembers = [
        {
            id: 1,
            name: "Nyle John Alon",
            role: "Front End Developer",
            bio: "Nyle is a passionate front-end developer with a knack for creating user-friendly interfaces. He loves turning complex problems into simple, beautiful designs. With over 5 years of experience in web development, Nyle specializes in React and modern JavaScript frameworks. He's committed to writing clean, maintainable code and creating responsive designs that work across all devices.",
            image: team1,
            social: {
                linkedin: "https://linkedin.com/",
                github: "https://github.com/",
                email: "nyle@pahiramcar.com",
            },
        },
        {
            id: 2,
            name: "Vanz Andriano",
            role: "Front End Developer",
            bio: "Vanz is a skilled front-end developer who specializes in building responsive and interactive web applications. He enjoys collaborating with designers to bring ideas to life. With a background in graphic design and 4 years of development experience, Vanz brings a unique perspective to every project. He's passionate about user experience and accessibility, ensuring that all applications are usable by everyone.",
            image: team2,
            social: {
                linkedin: "https://linkedin.com/",
                github: "https://github.com/",
                email: "vanz@pahiramcar.com",
            },
        },
        {
            id: 3,
            name: "Joaquin Sarmiento",
            role: "Front End Developer",
            bio: "Joaquin is a creative front-end developer with a passion for crafting seamless user experiences. He is always eager to learn new technologies and improve his skills. With a degree in Computer Science and 3 years of professional experience, Joaquin excels at problem-solving and implementing complex features. He's particularly interested in animation and interactive elements that enhance user engagement.",
            image: team3,
            social: {
                linkedin: "https://linkedin.com/",
                github: "https://github.com/",
                email: "joaquin@pahiramcar.com",
            },
        },
        {
            id: 4,
            name: "Rhem Giou Salvador",
            role: "Back End Developer",
            bio: "Rhem is a dedicated back-end developer who focuses on building robust and scalable server-side applications. He enjoys solving complex challenges and optimizing performance. With expertise in database design and API development, Rhem ensures that our applications run smoothly and securely. He has 6 years of experience working with various backend technologies and is constantly exploring new ways to improve system architecture.",
            image: team4,
            social: {
                linkedin: "https://linkedin.com/",
                github: "https://github.com/",
                email: "rhem@pahiramcar.com",
            },
        },
    ]

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Our dedicated team of professionals is committed to providing you with the best car rental experience. With
                        diverse expertise and a shared passion for excellence, we work together to ensure your journey is smooth and
                        enjoyable.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {teamMembers.map((member) => (
                        <div
                            key={member.id}
                            className="bg-white rounded-lg overflow-hidden shadow-sm transition-transform hover:transform hover:scale-105"
                        >
                            <div className="h-64 overflow-hidden">
                                <img
                                    src={member.image || "/placeholder.svg"}
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                                <p className="text-gray-600 text-sm mb-3">{member.role}</p>
                                <p className="text-gray-700 text-sm mb-4">{member.bio}</p>
                                <div className="flex space-x-3">
                                    <a href={member.social.linkedin} className="text-gray-600 hover:text-black" aria-label="LinkedIn">
                                        <Linkedin size={18} />
                                    </a>
                                    <a href={member.social.github} className="text-gray-600 hover:text-black" aria-label="GitHub">
                                        <Github size={18} />
                                    </a>
                                    <a
                                        href={`mailto:${member.social.email}`}
                                        className="text-gray-600 hover:text-black"
                                        aria-label="Email"
                                    >
                                        <Mail size={18} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
