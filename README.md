# HaexHub - The European "Everything App"

## Vision

Today, we undoubtedly find ourselves in the computer age. Almost everyone owns at least one computer, often even more. Most probably have at least a smartphone and a standard PC. On each of these devices (Desktop PC, Laptop, Tablet, Smartphone) and systems (Windows, macOS, Linux (all flavors), Android, iOS), there are various programs and data, which can be highly individual and sensitive. Unfortunately, interoperability between these devices and systems often proves difficult, sometimes even impossible, for a multitude of reasons. On one hand, there are the system providers themselves (like Microsoft, Apple, Google), who often design their systems to make it as easy as possible for users to enter their ecosystems, but place many hurdles in the way when users wish to leave again. The golden cage, as we say in Germany, or walled garden. However, it's not just the system providers per se who make cross-device and cross-system work difficult. Another problem lies with the software manufacturers/providers. Since it is already challenging and above all resource-intensive (time, money, and technical know-how) to provide a good and "secure" product for one device class and/or system, it's not uncommon for a program to be developed (initially) for only one platform. So, there might be a program for Windows or Apple, but not for Linux, or only in one distribution/package format. Or there might be an app for iOS and/or Android, but not for the PC. This is partly due to the fact that it would simply be too complex to develop and, especially, maintain a product for multiple systems and devices (simultaneously). This effort is almost insurmountable, particularly for startups, small businesses, and individual open-source developers working on their passion projects in their spare time.
Let's not even start talking about application distribution. For each platform, you end up with a separate build pipeline that builds, tests, signs, packages the application into the appropriate format (msi, exe, deb, flatpak, snap, AppImage, Apk, etc.), and delivers it to the corresponding store (AppStore, PlayStore, Windows Store, and the various repositories of Linux distributions). This is a huge cascade of tasks that especially causes problems for small companies (at least if you want to serve ALL platforms simultaneously).
Wouldn't it be nice if there were a simple way for developers to develop and build their application just once and then be able to serve ALL\* devices and systems? To have your "entire computer" on your USB stick, everywhere, at any time? And no matter which computer in the world you're currently using, you have everything with you? All programs, files, passwords, etc., on every device (Desktop PC, Laptop, Tablet, Smartphone), every system (Windows, macOS, Linux (all flavors), Android, iOS), anytime. Yes, this might sound confusing and unreal at first, but the idea is fantastic. It would give users back more digital self-empowerment. Only when users can no longer be held captive in golden cages can they emancipate themselves from the tech giants. Only when users can decide for themselves at any time which data they want to share with whom, for what purpose, and for what period, are they truly masters and not just commodities of their data.

And HaexHub would be the path to achieve this.

\*In principle, the approach presented here allows an application to run on all devices and systems. However, some applications might still only be usable on certain devices or systems. For example, if an application absolutely requires an NFC device, which is typically not found on a desktop PC, then this application will probably only work on mobile devices. Or if an application requires system-specific interfaces or programs, such as the Registry on Windows or systemd on Linux, then this application will naturally only work where these dependencies are found. However, developers who create their applications without such dependencies can immediately serve all devices and systems.

## Enter HaexHub

HaexHub provides a framework that makes it incredibly easy for the community and any developer to build extensions (web applications), which can then be easily integrated into HaexHub by users. Each extension is essentially a web application that can be loaded, executed, customized, and deleted at runtime. Each extension is confined within an IFrame, communicating with HaexHub via APIs using postMessage. HaexHub, in turn, checks these requests for the necessary permissions, executes or rejects the command, and returns a possible response to the caller – ideally, the correct result.
Since these are purely web applications, they are initially subject to the same limitations as any other web application in any "normal" browser worldwide. Fun Fact: Extensions in HaexHub are even more restricted than that. While a "normal" web application can, for example, load additional resources (JavaScript, CSS, images, ads) (assuming CORS allows it), this is initially not possible with a HaexHub extension. Everything the extension needs to be able to do must be specified as a permission in a manifest and approved by the user before (potentially) dangerous actions are executed on the host. And loading external resources is already considered such a risk from Tauri's (and my) perspective, as it can severely compromise the user's privacy.
With the appropriate permissions, however, an extension can do almost anything possible on a computer. Thus, unlike a "normal" web application, an extension can directly access the host's file system, execute other applications and commands, make/manipulate/block web requests, or access the SQLite database. To use these interfaces, each extension must declare the corresponding permissions in a manifest, which must then be approved by the user. Otherwise, no access to the host system is possible. Extensions can be added and removed at runtime. Since the extension runs in an IFrame, it cannot cause much damage without the appropriate permissions. It would be a pure web application where routing within the application is possible (WebHistoryHash). However, as soon as it tries to load external resources, regardless of whether they are local from the host or from any server on the World Wide Web, the extension is on its own without permission.
Technically, for example, it would pose no problem to make the host system's shell available to extensions. This could give Visual Studio Code in the browser superpowers. While a web version of Visual Studio Code already exists, its usability is limited. For instance, it's not possible to directly access the shell or the file system, which significantly hinders file management. And since no commands or applications can be executed on the host, it's (unfortunately) practically useless for developers. Visual Studio Code as a HaexHub extension could be used like a native application. And thanks to HaexHub's permission concept, it can be controlled with fine granularity which extension is allowed to execute what and how, and what is not. An extension with such power over the host, which can be both advantageous and disadvantageous for the user, should naturally be handled with particular care. It would probably not be a good idea to grant this permission to any advertising and data tracking services.

The framework itself provides a platform that will be available on all common devices (Desktop PC, Laptop, Tablet, Smartphone) and systems (Windows, macOS, Linux (all flavors), Android, iOS). All extensions can then be used on all supported devices and systems (provided there are no dependencies in the extension that are only available on specific devices or systems, like NFC, Google Pay, etc.).
All user and extension data can be securely stored and used in the locally encrypted SQLite database. To enable comfortable use of the database across multiple devices and systems, there will be a synchronization server that allows the database to be synchronized conflict-free across devices and systems. This server can, of course, also be self-hosted, ensuring the user is never dependent on a single provider.
Furthermore, the data can be encrypted beforehand, making it unreadable by third parties.

HaexHub is a cross-platform, local-first, open-source application that prioritizes user privacy, security, and digital sovereignty. The goal is for the user to have control over their data at all times and be able to independently decide what they want to disclose to whom. Additionally, they should be able to adjust this decision at any time.
Through the possibility of extensions, HaexHub is also almost infinitely expandable. What Visual Studio Code is for text editors/IDEs, HaexHub will be for (web) applications and even has the potential to become the European counterpart to WeChat (the "everything app"). However, without a central authority controlling everything.

But first things first.

## Technical Foundations

The technical foundation of the project is Tauri. This framework makes it possible to provide native applications for all common devices (Desktops, Laptops, Tablets, Smartphones) and systems (Windows, Linux, macOS, Android, iOS) with the same codebase. Tauri is comparable to Electron (the technical basis for Visual Studio Code, for example), but the applications created with it are significantly smaller because Tauri uses the native rendering engine of the respective platform (WebView2 (Windows), WKWebView (macOS), WebKitGTK (Linux)) and does not bundle a (customized Chromium) browser, as is the case with Electron. Furthermore, Tauri offers significant advantages over Electron in terms of security and resource efficiency. There is also a sophisticated permission system, which effectively shields the frontend from the host. All access to the host system is only possible with the appropriate permission. This permission concept is also used for the (HaexHub) extensions, thereby ensuring the security of third-party extensions as well.

The project follows a strict local-first approach. This means that HaexHub can fundamentally be used without any form of online account or internet access. The extensions are also stored locally and can be used offline, provided, of course, that the extension itself can function without the internet. A messenger extension will likely make limited sense without internet access. An image viewer or text editor, however, should work fine without the internet.
All user data can be persistently stored and used in a locally encrypted SQLite database, even across extensions, with the appropriate permissions, of course. Unlike many other applications that call themselves local-first, this project implements this approach more consistently. Most applications claiming to be local-first often aren't truly so. The data usually resides (unencrypted) on a backend server and is merely "cached" to varying degrees in the frontend. While this allows these applications to be used offline for a while, the usage is either restricted (read-only in Bitwarden, for example) or the persistence is temporary at best. Most approaches, like this project, use an SQLite (or similar) database in the frontend to achieve offline capability, but this is usually implemented in a browser via IndexedDB or OPFS. Examples include powersync, evolu, or electricSql. The problem here is that such persistence is never truly permanent, as the operating system and/or browser can decide when to free up storage. For instance, it's common for Apple to clear the storage of web applications that haven't been used for over a week. As long as the user's data is still present in the backend, this is only moderately tragic, as the "source of truth" residing there can be synchronized back to the frontend at any time. However, this always requires an online account and internet access. Furthermore, with these approaches, the user cannot simply copy their data onto a USB stick and take it with them to use on a completely different computer (perhaps where only intranet is available).
Moreover, all these approaches are subject to the limitations of the respective browser. The limitation on persistent storage is particularly noteworthy here. All browsers have strict limits, which is why this approach is not suitable for all requirements. Since HaexHub stores data not in the browser, but in a real SQLite database on the hard drive, it is only subject to the hardware limitations of the host system (or USB stick/storage medium).

With HaexHub, all user and extension data can be permanently stored in the local and encrypted database without requiring an online account. However, to make the user's data conveniently and securely available on multiple devices, there will be a synchronization service to synchronize the database state across the user's various devices and systems. The user can, of course, also host this service themselves on their (local) systems or servers. The database state is thus temporarily stored on a (third-party) server and can be synchronized from there with other instances of the local SQLite database. To further enhance data security, the user can also encrypt the data before sending it to the backend, making it unreadable by third parties. This will likely be enabled by default, but it can also be turned off, as there are legitimate use cases where it might be disadvantageous or undesirable. Particularly in corporate or government environments, it could be problematic if all user (employee) data were stored encrypted on the company servers. If the employee becomes unavailable (resignation, accident, death) and their database password (or the encryption key stored in the database) is unknown, there would be no way to access this data.
Since this use case should also be considered, backend encryption will be optional.

As HaexHub is ultimately a kind of distributed and federated system, there is no (single) authority that could control everything. Unless the user truly has only one instance of their database (perhaps on a USB stick) and always carries it with them. Part of HaexHub's charm, however, is that the user can have multiple instances of their SQLite database on multiple devices and systems without having to worry about how the correct data (source of truth) gets from A to B and B to A.
To make this possible and to synchronize even conflicting data states of the SQLite database, HaexHub uses Conflict-free Replicated Data Types (CRDTs). This will make it possible to merge multiple conflicting data states, even if they are encrypted.

## Extensions

The real highlight of HaexHub, however, lies in its extensions. All end-user functionality will ultimately be provided through extensions. There will be (official/core) extensions and third-party extensions. One of the first (official) extensions will be a password manager, for example, but a file synchronization service is also planned.
Each extension is essentially just a web application\* loaded into an IFrame. This keeps all extensions well isolated (sandboxed) from the main application (HaexHub) and the user's host system, ensuring the user's security and privacy. Of course, as with any application, a degree of trust must be placed in the extension developer that they are genuinely only doing what they claim to do. HaexHub is ingenious, but it can't perform magic.
Each extension must declare the permissions it requires in a manifest, which must then be accepted by the user. This ensures that each extension can only access the resources (file system, web requests, database access, etc.) for which it has the appropriate permissions.

In principle, any (existing) web application could be integrated and run within HaexHub. Technically, each extension is just a web application, but with significantly more capabilities. Traditional web applications are restricted by the (justified) limitations of a browser. For example, a web application cannot simply access the host system's file system or manipulate network traffic. And for good reasons. With HaexHub, however, these limitations do not exist. A (HaexHub) extension can indeed access the file system if it has the corresponding permission. This opens up almost unlimited application possibilities, making the term "everything app" seem not so far-fetched. In a future iteration, a browser and later a payment option (GNU Taler?!) are planned to be added, so it could truly become a fully-fledged counterpart to WeChat. However, these aspects are not considered in the first iteration of the application.
By providing extensions, HaexHub can truly be enhanced arbitrarily. Extension developers could use simple tools (Vite application) to immediately provide their functionality for all devices and systems and utilize the provided ecosystem, without the developer having to deal with the peculiarities of each system for development and distribution. (Provided, of course, they don't rely on dependencies that only exist on specific systems or devices).
Extensions can also access the data of other extensions (e.g., via the SQLite database) and build upon it (with appropriate permission, naturally).
I want to outline this with a concrete example. The first official extension will be a password manager.
This will be a Nuxt/Vue application. The password manager's manifest will request permission to create a few tables and to read from and write to them. The extension then provides a nice UI for creating and managing login credentials, similar to existing password managers. Each entry can also be tagged, which could later be used by other extensions.
For example, entries tagged "E-Mail" could be created, which could then be used by an email client extension to automatically connect to mail servers.
Any other extension could access specific entries in the password database (or other extensions' data) to easily provide its service.
But of course, each extension can also create its own tables as needed for its specific use case.
HaexHub takes care of secure storage and, if configured, conflict-free synchronization.
Each user can expand their HaexHub with the individual functionality they need. And since all settings for these extensions can be stored in the SQLite database, they can be easily and seamlessly synchronized and used across multiple devices. The user only needs to set up their extensions once on one device and can then use them on all other devices and systems without further action.

Another example of an extension would be file synchronization, which will also be a core extension.
This extension allows users to easily synchronize their files across different devices and systems. It can be configured on each device which files and folders should be synchronized and how. For instance, one might want to upload pictures and videos from their smartphone to an S3 bucket/Google Drive/Dropbox and their desktop PC. However, one probably doesn't want all pictures from the S3 bucket/Google Drive/Dropbox/Desktop to be synchronized back to the smartphone. All these configurations will again be stored in the SQLite database and, where possible, synchronized across all devices and systems.

Further examples of extensions include calendars, (collaborative) document management, contacts, messengers, and in the distant future, a browser and payment service (GNU Taler perhaps?!).

\*Fundamentally, any bundler (Vite, Webpack, Rollup, etc.) and any frontend framework (Vue, React, Angular, Svelte, plain HTML) should be usable. The crucial part is that it's a JS bundle. However, initially, the focus will primarily be on Vite and Vue to demonstrate the general feasibility first.

## Preperation

install:

- [nodejs](https://nodejs.org/en/download)
- [tauri](https://v2.tauri.app/start/prerequisites/)
- [rust](https://v2.tauri.app/start/prerequisites/#rust)

- port 3003 needs to be open/free or you need to adjust it in `nuxt.config.ts` AND `src-tauri/tauri.conf.json`

- `git clone https://github.com/haexhub/haex-vault.git`
- `cd haex-vault`
- `pnpm i`
- `pnpm tauri dev`
