import java.util.Scanner;

public class InteractiveStory {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Welcome to the Interactive Story!");
        startStory(scanner);
        scanner.close();
    }

    // Function to start the story
    public static void startStory(Scanner scanner) {
        System.out.println("\nYou awaken in a dimly lit workshop, gears whirring around you. On the desk, an ancient alchemical tome and a brass time device hum with energy.");
        System.out.println("What do you do?");
        System.out.println("1. Read the Alchemical Tome");
        System.out.println("2. Activate the Time Device");
        System.out.println("3. Wait and observe");
        System.out.print("Enter your choice (1, 2, or 3): ");

        int choice = scanner.nextInt();
        scanner.nextLine(); // Consume the newline character

        switch (choice) {
            case 1:
                readTome(scanner);
                break;
            case 2:
                activateDevice(scanner);
                break;
            case 3:
                waitAndObserve(scanner);
                break;
            default:
                System.out.println("Invalid choice. Please try again.");
                startStory(scanner);
        }
    }

    // Path 1: Read the Alchemical Tome
    public static void readTome(Scanner scanner) {
        System.out.println("\nAs you open the tome, glowing symbols appear. A potion recipe catches your eye.");
        System.out.println("What do you do?");
        System.out.println("1. Brew the Potion");
        System.out.println("2. Explore the Workshop");
        System.out.print("Enter your choice (1 or 2): ");

        int choice = scanner.nextInt();
        scanner.nextLine(); // Consume the newline character

        switch (choice) {
            case 1:
                System.out.println("\nYou brew a shimmering elixir. Drinking it, you gain the ability to see into the future!");
                System.out.println("What will you do with this power?");
                System.out.println("1. Use your vision to predict events");
                System.out.println("2. Attempt to alter fate");
                System.out.print("Enter your choice (1 or 2): ");

                int subChoice = scanner.nextInt();
                scanner.nextLine(); // Consume the newline character

                if (subChoice == 1) {
                    System.out.println("\nYou predict the future, becoming wealthy beyond your dreams. However, a feeling of fear surrounds you.");
                } else if (subChoice == 2) {
                    System.out.println("\nYou attempt to alter fate, but your actions have unintended consequences. You cease to exist.");
                } else {
                    System.out.println("Invalid choice. Ending story.");
                }
                break;

            case 2:
                System.out.println("\nExploring the workshop, you discover a hidden compartment with blueprints for an airship. Adventure awaits!");
                System.out.println("What do you do?");
                System.out.println("1. Build the airship");
                System.out.println("2. Sell the blueprints for gold");
                System.out.print("Enter your choice (1 or 2): ");

                subChoice = scanner.nextInt();
                scanner.nextLine(); // Consume the newline character

                if (subChoice == 1) {
                    System.out.println("\nYou build the airship, but on its maiden flight, it explodes. You make your peace.");
                } else if (subChoice == 2) {
                    System.out.println("\nYou sell the blueprints, but the buyer betrays you. Everything fades to black.");
                } else {
                    System.out.println("Invalid choice. Ending story.");
                }
                break;

            default:
                System.out.println("Invalid choice. Ending story.");
        }

        restartStory(scanner);
    }

    // Path 2: Activate the Time Device
    public static void activateDevice(Scanner scanner) {
        System.out.println("\nYou activate the time device! A vortex opens, offering two choices:");
        System.out.println("1. Travel to Victorian London");
        System.out.println("2. Enter the Steampunk Metropolis");
        System.out.print("Enter your choice (1 or 2): ");

        int choice = scanner.nextInt();
        scanner.nextLine(); // Consume the newline character

        switch (choice) {
            case 1:
                System.out.println("\nYou arrive in Victorian London, where secret societies seek alchemical knowledge.");
                System.out.println("What do you do?");
                System.out.println("1. Join the secret society");
                System.out.println("2. Oppose them and uncover their secrets");
                System.out.print("Enter your choice (1 or 2): ");

                int subChoice = scanner.nextInt();
                scanner.nextLine(); // Consume the newline character

                if (subChoice == 1) {
                    System.out.println("\nYou join the secret society, unlocking ancient knowledge but losing your freedom.");
                } else if (subChoice == 2) {
                    System.out.println("\nYou oppose the society, but they hunt you down. The walls close in, and everything goes dark.");
                } else {
                    System.out.println("Invalid choice. Ending story.");
                }
                break;

            case 2:
                System.out.println("\nThe metropolis is alive with steam-powered automatons and airships. A masked figure offers you a mission.");
                System.out.println("What do you do?");
                System.out.println("1. Accept the mission");
                System.out.println("2. Decline and explore the city");
                System.out.print("Enter your choice (1 or 2): ");

                subChoice = scanner.nextInt();
                scanner.nextLine(); // Consume the newline character

                if (subChoice == 1) {
                    System.out.println("\nYou accept the mission and retrieve the Chrono Crystal, but it fuses with your body. You become the guardian of time.");
                } else if (subChoice == 2) {
                    System.out.println("\nYou decline the mission and explore the city, but you feel a sense of missed opportunity.");
                } else {
                    System.out.println("Invalid choice. Ending story.");
                }
                break;

            default:
                System.out.println("Invalid choice. Ending story.");
        }

        restartStory(scanner);
    }

    // Path 3: Wait and Observe
    public static void waitAndObserve(Scanner scanner) {
        System.out.println("\nYou wait and observe. A mysterious figure emerges from the shadows. It's Cleopatra the Alchemist!");
        System.out.println("What do you do?");
        System.out.println("1. Join her");
        System.out.println("2. Shake your head and walk away");
        System.out.print("Enter your choice (1 or 2): ");

        int choice = scanner.nextInt();
        scanner.nextLine(); // Consume the newline character

        switch (choice) {
            case 1:
                System.out.println("\nCleopatra smiles. 'You have chosen wisely,' she says. Together, you unlock the secrets of the Philosopher's Stone.");
                break;
            case 2:
                System.out.println("\nYou shake your head and walk away. As you leave, you notice a small vial on the desk. A note reads: 'For the seeker of knowledge.'");
                break;
            default:
                System.out.println("Invalid choice. Ending story.");
        }

        restartStory(scanner);
    }

    // Function to restart the story
    public static void restartStory(Scanner scanner) {
        System.out.println("\nThe story has ended. Would you like to start again? (yes/no)");
        String restartChoice = scanner.nextLine().toLowerCase();

        if (restartChoice.equals("yes")) {
            startStory(scanner);
        } else {
            System.out.println("Thank you for playing!");
        }
    }
}