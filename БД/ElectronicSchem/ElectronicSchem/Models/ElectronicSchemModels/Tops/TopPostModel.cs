using ElectronicSchem.Models.ElectronicSchemModels.Posts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ElectronicSchem.Models.ElectronicSchemModels.Tops
{
    public class TopPostModel
    {
        public PostModel Post { get; set; }

        public int Rating { get; set; }

        public static int ComparerByRating(TopPostModel post1, TopPostModel post2)
        {
            return Math.Sign(post1.Rating - post2.Rating);
        }
    }
}