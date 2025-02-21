public class minswaps {
    public static int minSwaps(String s) {
        int balance = 0;
        int maxImbalance = 0;

        for (char ch : s.toCharArray()) {
            if (ch == '(') {
                balance++;
            } else {
                balance--;
            }
            maxImbalance = Math.min(maxImbalance, balance);
        }

        return (-maxImbalance + 1) / 2;
    }

    public static void main(String[] args) {
        String s = "())))(((";
        System.out.println(minSwaps(s)); // Output: 1
    }
}
