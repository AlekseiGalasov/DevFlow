import {auth, signOut} from "@/auth";
import {Button} from "@/components/ui/button";
import ROUTES from "@/constans/routes";
import Link from "next/link";
import LocalSearch from "@/components/search/LocalSearch";

const Home = async () => {

    return (
        <>
            <section className='flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center'>
                <h2 className='h1-bold text-dark100_light900'>All questions</h2>
                <Button asChild className='primary-gradient min-h-[46px] px-4 py-3 !text-light-900'>
                    <Link href={ROUTES.ASK_QUESTION('1')} >
                        Ask a question
                    </Link>
                </Button>
            </section>
            <section className='mt-11'>
                <LocalSearch placeholder='Local search' imagePath='/icons/search.svg' />
            </section>
            <section className='mt-10 flex w-full flex-col gap-6'>
                <p>Question Card</p>
                <p>Question Card</p>
                <p>Question Card</p>
                <p>Question Card</p>
                <p>Question Card</p>
                <p>Question Card</p>
            </section>
        </>
    );
}

 export default Home