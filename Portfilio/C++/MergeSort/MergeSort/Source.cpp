#include <string>
#include <stdio.h>
#include <iostream>
#include <fstream>
#include <time.h>
#include <vector>
using std::cout; // so i dont have to type STD::COUT
using std::vector;
using std::string;
using std::cin;
typedef struct node
{
	int data;               // will store information
	node *next;             // the reference to the next node
};
struct node* RandomList(struct node* RandomList);
struct node* FileInsert(string path, struct node* vectorList);
void MergeSort(struct node** headRef);
struct node* Merge(node* a, node* b);
void Split(node* source, node** frontRef, node** backRef);
void Insert(node** pos ,int info);
void Print(node* node);
int sizeOf(node** list);
int UserInput(); // takes user input
int main()
{
	node* head = NULL; // creating a empty link list
	node* vectorList = NULL; //creating the list
	node* randomList = NULL; // creating the list
	node* UIList = NULL; //creating the list 
	int vectorSize; // checking for size
	cout << "Would you like to insert your own file or would you like me to insert the numbers for you?\nPress 1 for inserting your own file\nPress 2 for me creating random numbers for you\nPress 3 if you would like to create your own list\n";
	char choice; //defining variables
	cin >> choice;
	string path;
	int numberOfIndexs; //defining variables
	switch (choice) //switch statement for user input
	{
	case '1': //insert a file from user choice
		cout << "Please type the path of your file\n";
		cin >> path;
		FileInsert(path, vectorList); //calling fileInsert function
		cout << "Your orignal list is: ";
		vectorSize = sizeOf(&vectorList);
		Print(vectorList);
		cout << "\n";
		cout << "Your sorted list is: ";
		MergeSort(&vectorList);
		Print(vectorList);
		cout << "\n";
		break;
	case '2': //create a random list 
		randomList = RandomList(randomList);
		cout << "Your orignal list is: ";
		Print(randomList);
		cout << "\n";
		cout << "Your sorted list is: ";
		MergeSort(&randomList);
		Print(randomList);
		cout << "\n";
		break;
	case '3': //user inputs a list in the computer.
		cout << "How many numbers would you like to insert?\n";
		cin >> numberOfIndexs; 
		for (int i = 0; i < numberOfIndexs; i++)//getting user input for the vector
		{
			Insert(&UIList, UserInput());
		}
		cout << "Your orignal list is: ";
		Print(UIList);
		cout << "\n";
		cout << "Your sorted list is: ";
		MergeSort(&UIList);
		Print(UIList);
		cout << "\n";
		break;
	default: //debugging for the user.
		cout << "You entered the wrong input!\n";

		break;
	}
	cout << "The time it took to complete this code: " << clock() << '\n';
	system("Pause");
	return 0;
}
int UserInput() //takes userinput and returns it
{
	cout << "What Number would you like to insert?\n";
	int userChoice;
	cin >> userChoice;
	return userChoice;
}
struct node* FileInsert(string path, struct node* vectorList)
{
	std::ifstream is(path); // looks for the path
	int fileNumber;
	if(is.is_open()) // checking to see if the file is open
	{
		do{
			is >> fileNumber;
			Insert(&vectorList, fileNumber); //inserting the file with the numbers
			} while (!is.eof());
	}
	else //if the file does not open debug for user
	{
		cout << "Could not find the file\n";
	} 
	return vectorList;
}
struct node* RandomList(struct node* randomList)
{ 
		int randomNumber;
		for (int i = 0; i < 1000; i++) //for loop for creating the 20 random numbers
		{
			randomNumber = rand() % 100 + 1; //creating a random number between 1 and 100
			Insert(&randomList, randomNumber); //inserting the random numbers
		} // storing the random numbers in the array
		return randomList;
}
void MergeSort(struct node** headRef)
{
	node* head = *headRef; //setting head to the headref  list
	node* leftList; //creating a left lsit
	node* rightList; // creating a right list
	if ((head == NULL) || (head->next == NULL)) // if head is null or the next index is cannot split anymore so return
	{
		return;
	}
	Split(head, &leftList, &rightList);//splitting the list into 2
	MergeSort(&leftList); // splitting the left list again
	MergeSort(&rightList); //splitting the right list again
	*headRef = Merge(leftList, rightList); //setting original list to the merged list
}
node* Merge(struct node* leftList, struct node* rightList)
{
	node* result = NULL; //creating result to be null
	if (leftList == NULL) //if left list is null add right list to the result list
		return rightList;
	else if (rightList == NULL)
		return leftList;
	if (leftList->data <= rightList->data) // comparing the list together
	{
		result = leftList;
		result->next = Merge(leftList->next, rightList);
	}
	else // comparing the list together
	{
		result = rightList;
		result->next = Merge(leftList, rightList->next);
	}
	return result; //returning result
}
void Split(node* source, node** frontRef, node** backRef) // splits the lists
{
	node* fast; //creating 2 list
	node* slow;
	if (source == NULL || source->next == NULL) 
	{
		*frontRef = source;
		*backRef = NULL;
	}
	else 
	{
		slow = source; // splitting the list in 2 odds go to slow
		fast = source->next; // evens go to fast
		while (fast != NULL)
		{
			fast = fast->next; //storing the data in fast
			if (fast != NULL)
			{
				slow = slow->next; // increasing the the next vlaue
				fast = fast->next; // same
			}
		}
		*frontRef = source; //setting the frontref to source
		*backRef = slow->next; //setting that to the slow index
		slow->next = NULL; // setting to null
	}
}

void Insert(node** pos, int info)
{
	node *newNode = new node; //creating aa new node
	newNode->data = info; //setting the data to = info
	newNode->next = (*pos); // going to the next postion
	(*pos) = newNode; // setting nodes to equal eachother
}
void Print(node* node)
{
	while (node != NULL) // while list isnt null
	{
		cout << node->data << " | "; // print this out
		node = node->next; // go to next value
	}

}
int sizeOf(node** list) // checking the size of the list
{
	node* head = *list;
	int size = 0;
	if (head == NULL)
	{
		return size; // returns the size of hte list
	}
	else
	{
		while (head != NULL)
		{
			size++;
			head = head->next;// going the the next list portion
		} // add to the size
	}
	return size;
}